"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBookCard } from "@/components/AddBookCard";

const Page = () => {
  const [books, setBooks] = useState([
    { id: "1", title: "Atomic Habits", status: "AVAILABLE" },
    { id: "2", title: "Rich Dad Poor Dad", status: "RENTED" },
    { id: "3", title: "The Subtle Art of...", status: "EXCHANGED" },
  ]);

  const filterBooks = (status: string) =>
    books.filter((book) => book.status === status);

  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Books</h1>
          <div className="space-x-2">
            <Button variant="outline">Exchange Requests</Button>
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
                <Card key={book.id}>
                  <CardHeader>
                    <CardTitle>{book.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Status: Available</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="RENTED">
            <div className="grid gap-4 mt-4">
              {filterBooks("RENTED").map((book) => (
                <Card key={book.id}>
                  <CardHeader>
                    <CardTitle>{book.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Status: Rented</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="EXCHANGED">
            <div className="grid gap-4 mt-4">
              {filterBooks("EXCHANGED").map((book) => (
                <Card key={book.id}>
                  <CardHeader>
                    <CardTitle>{book.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Status: Exchanged</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <AddBookCard
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default Page;
