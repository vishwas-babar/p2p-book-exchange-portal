'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Book } from "@/app/(main)/books/page"
import axios from "axios"
import { BackendUrl } from "@/config"
import { useAuthUser } from "@/hooks/useAuthUser"

interface ExchangeCardProps {
  selectedBook: Book
  userBooks: Book[]
  onCancel: () => void
  onExchanged: () => void
}

const ExchangeCard = ({ selectedBook, userBooks, onCancel, onExchanged }: ExchangeCardProps) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuthUser()

  const handleExchange = async () => {
    if (!selectedBookId) return alert("Please select a book to exchange with")

    setLoading(true)
    const res = await axios.post(`${BackendUrl}/book/exchange`,
      {
        bookAId: selectedBook.id,
        bookBId: selectedBookId,
        userId: user?.id
      }
    )

    if (res.data) {
      alert("Books exchanged successfully!")
      onExchanged()
    } else {
      alert("Exchange failed!")
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Exchange Book: {selectedBook.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Select one of your books to exchange with:</Label>
          <Select onValueChange={setSelectedBookId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose a book" />
            </SelectTrigger>
            <SelectContent>
              {userBooks
                .filter((book) => book.status === "AVAILABLE" && book.id !== selectedBook.id)
                .map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title} - {book.author}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleExchange} disabled={loading || !selectedBookId}>
            {loading ? "Exchanging..." : "Confirm Exchange"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExchangeCard
