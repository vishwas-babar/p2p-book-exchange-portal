"use client"

import { useEffect, useState } from "react"
import { BookCard } from "@/components/BookCard"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { BackendUrl } from "@/config"
import { useRouter } from "next/navigation"
import { useAuthUser } from "@/hooks/useAuthUser"

type Book = {
    id: string
    title: string
    author: string
    genre?: string
    city: string
    contact: string
    coverImage: string
    status: "AVAILABLE" | "RENTED"
    owner: {
        id: string
        name: string
        email: string
    }
    rentedBy?: {
        id: string
        name: string
        email: string
    }
}

export default function RentedBooksPage() {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    const { ownerStatus, user } = useAuthUser()

    useEffect(() => {
        if (!user) return
        fetchBooks()
    }, [user])

    const fetchBooks = async () => {

        try {
            const res = await axios.get(`${BackendUrl}/book/get-all/rented?userId=${encodeURIComponent(user?.id || "")}`) // Adjust if your route differs
            if (!res.data) throw new Error("Failed to fetch")

            const data = res.data;
            setBooks(data)
        } catch (err) {
            console.error("Error fetching rented books:", err)
            toast.error("Failed to load rented books")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">📚 Your Rented Books</h1>

            {loading ? (
                <div className="flex justify-center mt-20 text-muted-foreground">
                    <Loader2 className="animate-spin mr-2" />
                    Loading rented books...
                </div>
            ) : books.length === 0 ? (
                <p className="text-center text-muted-foreground">You {"haven't"} rented any books yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {books.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            userId={user?.id || ""}
                            fetchBooks={fetchBooks}
                            bookBelongsToOwner={book.owner.id === user?.id}
                            // onRent={() => { }} // no need to handle rent here
                            // onUnrent={() => { }} // optional: implement unrent here
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
