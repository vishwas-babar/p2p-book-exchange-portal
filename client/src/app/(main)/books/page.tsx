'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BookOpen, Repeat2 } from 'lucide-react'
import { BackendUrl } from '@/config'
import { useRouter } from 'next/navigation'
import { BookCard } from '@/components/BookCard'
import { toast } from 'sonner'
import TopNavBar from '@/components/TopNavBar'
import { useAuthUser } from '@/hooks/useAuthUser'
import ExchangeCard from '@/components/ExchangeCard'

export interface Book {
  id: string
  title: string
  author: string
  genre?: string
  city: string
  coverImage: string
  contact: string
  status: 'AVAILABLE' | 'RENTED'
  owner: {
    id: string
    name: string
    email: string
  }
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filters, setFilters] = useState({ city: '', genre: '', search: '' })
  const { ownerStatus, user } = useAuthUser()
  const [exchangeBook, setExchangeBook] = useState<Book | null>(null)
  const [ownerBooks, setOwnerBooks] = useState<Book[]>([])

  const fetchBooks = async () => {
    try {
      const query = new URLSearchParams(filters).toString()
      const res = await axios.get(`${BackendUrl}/book/get-all/available?userId=${encodeURIComponent(user?.id || "")}&${query}`)
      setBooks(res.data)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }

  const fetchOwnerBooks = async () => {
    try {
      const res = await axios.get(`${BackendUrl}/book/get-all/owner?ownerId=${user?.id}`)
      setOwnerBooks(res.data)
    } catch (error) {
      console.error('Error fetching owner books:', error)
    }
  }

  useEffect(() => {
    fetchBooks()
    fetchOwnerBooks()
  }, [ownerStatus])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleFilter = () => fetchBooks()


  return (
    <>
      {/* <TopNavBar /> */}
      <div className="p-6 px-60 space-y-6">
        <h1 className="text-2xl font-bold">Available Books</h1>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleInputChange}
          />
          <Input
            name="genre"
            placeholder="Genre"
            value={filters.genre}
            onChange={handleInputChange}
          />
          <Input
            name="search"
            placeholder="Search title or author"
            value={filters.search}
            onChange={handleInputChange}
          />
          <Button onClick={handleFilter}>Apply Filters</Button>
        </div>

        {/* Book List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.length === 0 && <p>No books found.</p>}
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              userId={user?.id || ""}
              fetchBooks={fetchBooks}
              onExchangeClick={() => setExchangeBook(book)}
              bookBelongsToOwner={book.owner.id === user?.id}
            />
          ))}
        </div>
      </div>

      {/* exchnage book card  */}
      {exchangeBook && (
        <ExchangeCard
          onCancel={() => setExchangeBook(null)}
          onExchanged={() => {
            setExchangeBook(null)
            toast.success('Books exchanged successfully!')
            fetchBooks()
          }
          }
          selectedBook={exchangeBook}
          userBooks={ownerBooks}
        />
      )}
    </>
  )
}
