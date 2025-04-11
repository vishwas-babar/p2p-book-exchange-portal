import { Request, Response } from "express";
import bookSchema from "../schemas/book.schema";
import prisma from "../lib/prisma";



export const handleAddBook = async (req: Request, res: Response) => {
    try {
        const { userId, ...data } = req.body;
        const parsed = bookSchema.safeParse(data);
        if (!parsed.success) {
            console.error("Validation errors:", parsed.error.errors);
            res.status(400).json({ error: parsed.error.errors });
            return
        }


        const book = await prisma.book.create({
            data: {
                ...parsed.data,
                ownerId: userId,
            },
        });

        res.status(201).json({ message: "Book added", book });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const handleGetAvailableBooks = async (req: Request, res: Response) => {
    try {
        const { city, genre, search } = req.query

        const books = await prisma.book.findMany({
            where: {
                status: { in: ['AVAILABLE', 'RENTED'] },
                ...(city && { city: { equals: String(city), mode: 'insensitive' } }),
                ...(genre && { genre: { equals: String(genre), mode: 'insensitive' } }),
                ...(search && {
                    OR: [
                        { title: { contains: String(search), mode: 'insensitive' } },
                        { author: { contains: String(search), mode: 'insensitive' } },
                    ],
                }),
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                rentedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })


        res.status(200).json(books)
    } catch (error) {
        console.error('Error fetching available books with filters:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}


export const handleMarkBookAsRented = async (req: Request, res: Response) => {
    const { bookId, rentedById } = req.body

    if (!bookId || !rentedById) {
        res.status(400).json({ message: 'bookId and rentedById are required' })
        return;
    }

    try {
        // Check if book exists and is available
        const book = await prisma.book.findUnique({ where: { id: bookId } })

        if (!book) {
            res.status(404).json({ message: 'Book not found' })
            return;
        }

        if (book.status !== 'AVAILABLE') {
            res.status(400).json({ message: 'Book is not available for rent' })
            return;
        }

        // Update the book
        const updatedBook = await prisma.book.update({
            where: { id: bookId },
            data: {
                status: 'RENTED',
                rentedById: rentedById,
            },
        })

        res.status(200).json({ message: 'Book rented successfully', book: updatedBook })
        return;
    } catch (error) {
        console.error('Error marking book as rented:', error)
        res.status(500).json({ message: 'Internal server error' })
        return;
    }
}


export const handleUnrentBook = async (req: Request, res: Response) => {
    const { bookId, userId } = req.body

    if (!bookId || !userId) {
        res.status(400).json({ message: "bookId and userId are required" })
        return
    }

    try {
        const book = await prisma.book.findUnique({ where: { id: bookId } })

        if (!book) {
            res.status(404).json({ message: "Book not found" })
            return
        }

        if (book.status !== "RENTED") {
            res.status(400).json({ message: "Book is not currently rented" })
            return
        }

        if (book.rentedById !== userId) {
            res.status(403).json({ message: "You are not the one who rented this book" })
            return
        }

        const updatedBook = await prisma.book.update({
            where: { id: bookId },
            data: {
                status: "AVAILABLE",
                rentedById: null,
            },
        })

        res.status(200).json({ message: "Book unrented successfully", book: updatedBook })
    } catch (error) {
        console.error("Error un-renting book:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}
