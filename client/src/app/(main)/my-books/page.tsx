"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBookCard } from "@/components/AddBookCard";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Book } from "../books/page";
import axios from "axios";
import { BackendUrl } from "@/config";
import { BookCard } from "@/components/BookCard";

const Page = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const filterBooks = (status: string) =>
    books.filter((book) => book.status === status);

  const [open, setOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  const { ownerStatus, user } = useAuthUser()

  useEffect(() => {

    if (user) {
      fetchOwnerBooks();
    }
    // Cleanup function to reset state or perform any necessary cleanup

    return () => {
      setBooks([]);
    }
  }, [user])


  const fetchOwnerBooks = async () => {
    try {
      const res = await axios.get(`${BackendUrl}/book/get-all?ownerId=${encodeURIComponent(user?.id || "")}`);
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching owner books:", error);
    }
  }

  const editBook = (book: Book) => {
    setEditingBook(book);
    setEditingBookId(book.id);
    setOpen(true);
  }

  if (ownerStatus === 'loading') {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-xl">
          loading...
        </h1>
      </div>
    )
  }

  if (ownerStatus === 'failed') {
    return (
      <div className="max-w-4xl flex items-center justify-center mx-auto mt-10 px-4">
        <h1 className="text-xl">
          you cant access this page!
        </h1>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Books</h1>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(true)}
            >Create New Book</Button>
          </div>
        </div>

        <p className="mb-6 text-muted-foreground">
          Here you can manage your books.
        </p>

        <Tabs defaultValue="AVAILABLE">
          <TabsList>
            <TabsTrigger value="AVAILABLE">Available</TabsTrigger>
            <TabsTrigger value="RENTED">Rented</TabsTrigger>
            <TabsTrigger value="EXCHANGED">Exchanged</TabsTrigger>
          </TabsList>

          <TabsContent value="AVAILABLE">
            <div className="grid gap-4 mt-4">
              {filterBooks("AVAILABLE").map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  userId={user?.id || ""}
                  fetchBooks={fetchOwnerBooks}
                  onExchangeClick={() => { }}
                  bookBelongsToOwner={book.owner.id === user?.id}
                  editBook={() => editBook(book)}

                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="RENTED">
            <div className="grid gap-4 mt-4">
              {filterBooks("RENTED").map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  userId={user?.id || ""}
                  fetchBooks={fetchOwnerBooks}
                  onExchangeClick={() => { }}
                  bookBelongsToOwner={book.owner.id === user?.id}
                  editBook={() => editBook(book)}

                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="EXCHANGED">
            <div className="grid gap-4 mt-4">
              {filterBooks("EXCHANGED").map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  userId={user?.id || ""}
                  fetchBooks={fetchOwnerBooks}
                  onExchangeClick={() => { }}
                  bookBelongsToOwner={book.owner.id === user?.id}
                  editBook={() => editBook(book)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <AddBookCard
        open={open}
        setOpen={setOpen}
        refetch={fetchOwnerBooks}
      />

      {editingBook && (
        <AddBookCard
          open={open}
          setOpen={setOpen}
          editing={true}
          editBookId={editingBookId || ""}
          refetch={fetchOwnerBooks}
        />
      )}
    </>
  );
};

export default Page;
