"use client"

import { BookOpen, Repeat2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Book = {
  id: string
  title: string
  author: string
  genre?: string
  city: string
  contact: string
  status: 'AVAILABLE' | 'RENTED'
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
  onRent: (bookId: string) => void
  onUnrent: (bookId: string) => void
}

export function BookCard({ book, userId, onRent, onUnrent }: BookCardProps) {
  const isRented = book.status === "RENTED"
  const isRentedByCurrentUser = book.rentedBy?.id === userId

  return (
    <div className="p-4 border rounded-xl shadow-md space-y-2 relative">
      {isRented && (
        <span className="absolute top-2 right-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
          Rented
        </span>
      )}

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

      <div className="flex gap-2 mt-2">
        {!isRented ? (
          <Button
            variant="default"
            className="flex gap-1 items-center"
            onClick={() => onRent(book.id)}
          >
            <BookOpen size={16} />
            Rent Book
          </Button>
        ) : isRentedByCurrentUser ? (
          <Button
            variant="destructive"
            className="flex gap-1 items-center"
            onClick={() => onUnrent(book.id)}
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

        {book.owner.id === userId && (
          <Button variant="outline" className="flex gap-1 items-center">
            <Repeat2 size={16} />
            Exchange Book
          </Button>
        )}
      </div>
    </div>
  )
}
