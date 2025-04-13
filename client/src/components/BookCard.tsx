"use client"

import Image from "next/image"
import { BookOpen, Repeat2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { BackendUrl } from "@/config"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthUser } from "@/hooks/useAuthUser"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



type Book = {
    id: string
    title: string
    author: string
    genre?: string
    city: string
    coverImage: string
    contact: string
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

type BookCardProps = {
    book: Book
    userId: string
    fetchBooks: () => void
    onExchangeClick: (book: Book) => void
    bookBelongsToOwner: boolean
    editBook?: (bookId: string) => void
}

export function BookCard({
    book,
    userId,
    fetchBooks,
    onExchangeClick,
    bookBelongsToOwner,
    editBook = () => { },
}: BookCardProps) {
    const isRented = book.status === "RENTED"
    const isRentedByCurrentUser = book.rentedBy?.id === userId

    const { ownerStatus, user } = useAuthUser()

    const rentTheBook = async (bookId: string) => {
        try {

            const res = await axios.post(`${BackendUrl}/book/rent`, {
                bookId,
                rentedById: user?.id,
            })
            if (res.status === 200) {
                toast.success('Book rented successfully!')
                fetchBooks()
            } else {
                toast.error('Error renting book!')
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                error.response?.data?.message && toast.error(error.response.data.message)
                return
            } else {
                toast.error('Error renting book!')
            }
            console.error('Error renting book:', error);
        }
    }

    const unrentTheBook = async (bookId: string) => {
        try {
            const res = await axios.post(`${BackendUrl}/book/unrent`, {
                bookId,
                userId: user?.id,
            })
            if (res.status === 200) {
                toast.success('Book unrented successfully!')
                fetchBooks()
            } else {
                toast.error('Error unrenting book!')
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                error.response?.data?.message && toast.error(error.response.data.message)
                return
            } else {
                toast.error('Error unrenting book!')
            }
            console.error('Error unrenting book:', error);
        }
    }

    const deleteBook = async (bookId: string) => {
        try {
            const res = await axios.delete(`${BackendUrl}/book/${bookId}`)
            if (res.status === 200) {
                toast.success('Book deleted successfully!')
                fetchBooks()
            } else {
                toast.error('Error deleting book!')
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                error.response?.data?.message && toast.error(error.response.data.message)
                return
            } else {
                toast.error('Error deleting book!')
            }
            console.error('Error deleting book:', error);
        }
    }

    return (
        <div className="p-4 border rounded-xl shadow-md space-y-3 relative bg-white">
            {/* Book Cover */}
            <div className="w-full h-48 relative flex items-center justify-center rounded-md overflow-hidden">
                <Image
                    src={book.coverImage}
                    alt={book.title}
                    height={400}
                    width={300}
                    className="object-contain h-full w-auto object-center"
                />
            </div>

            {/* Status badge */}
            {isRented && (
                <span className="absolute top-2 right-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full z-10">
                    Rented
                </span>
            )}


            {/* Dropdown for owner actions */}
            {bookBelongsToOwner && (
                <div className="absolute top-2 right-2 z-20">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={() => editBook(book.id)}
                            >
                                <Pencil size={16} />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                onClick={() => deleteBook(book.id)}
                            >
                                <Trash2 size={16} />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}



            <div className="space-y-1">
                <h2 className="text-lg font-semibold">{book.title}</h2>
                <p className="text-sm text-muted-foreground">by {book.author}</p>
                <p className="text-sm">Genre: {book.genre ?? "N/A"}</p>
                <p className="text-sm">City: {book.city}</p>
                <p className="text-sm">Contact: {book.contact}</p>

                <p className="text-xs text-muted-foreground">
                    Owner: {book.owner.name} ({book.owner.email})
                </p>

                {isRented && book.rentedBy && (
                    <p className="text-xs text-muted-foreground">
                        Rented by: {book.rentedBy.name} ({book.rentedBy.email})
                    </p>
                )}
            </div>

            {!bookBelongsToOwner && (
                <div className="flex gap-2 mt-2">
                    {!isRented ? (
                        <Button
                            variant="default"
                            className="flex gap-1 items-center"
                            onClick={() => rentTheBook(book.id)}
                        >
                            <BookOpen size={16} />
                            Rent Book
                        </Button>
                    ) : isRentedByCurrentUser ? (
                        <Button
                            variant="destructive"
                            className="flex gap-1 items-center"
                            onClick={() => unrentTheBook(book.id)}
                        >
                            <Undo2 size={16} />
                            Unrent Book
                        </Button>
                    ) : (
                        <Button variant="secondary" className="flex gap-1 items-center" disabled>
                            <BookOpen size={16} />
                            Already Rented
                        </Button>
                    )}

                    <Button
                        onClick={() => onExchangeClick(book)}
                        variant="outline" className="flex gap-1 items-center">
                        <Repeat2 size={16} />
                        Exchange Book
                    </Button>
                </div>
            )}

        </div>
    )
}
