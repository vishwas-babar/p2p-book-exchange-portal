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

interface Book {
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
}

export default function AvailableBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filters, setFilters] = useState({ city: '', genre: '', search: '' })
  const [user, setUser] = useState({
    id: '123',
    name: 'John Doe',
  })
  const [Owner, setOwner] = useState(false);
  const router = useRouter()

  useEffect(() => {

    const localStorageUser = localStorage.getItem('user')
    if (!localStorageUser) {
      alert('Please login to view available books')
      return router.push('/login')
    }

    const parsedUser = JSON.parse(localStorageUser || '');
    if (parsedUser.role === 'OWNER') {
      setOwner(true);
    }
    setUser(parsedUser)
  }, [])


  const fetchBooks = async () => {
    try {
      const query = new URLSearchParams(filters).toString()
      const res = await axios.get(`${BackendUrl}/book/get-all/available?${query}`)
      setBooks(res.data)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleFilter = () => fetchBooks()

  const rentTheBook = async (bookId: string) => {
    try {

      const res = await axios.post(`${BackendUrl}/book/rent`, {
        bookId,
        rentedById: user.id,
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
        userId: user.id,
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

  return (
    <div className="p-6 space-y-6">
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
            userId={user.id}
            onRent={rentTheBook}
            onUnrent={unrentTheBook}
          />
        ))}
      </div>
    </div>
  )
}
