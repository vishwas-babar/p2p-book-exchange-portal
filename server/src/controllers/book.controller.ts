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
        const { city, genre, search, userId } = req.query;

        if (!userId) {
            res.status(401).json({
                message: "please provide the current userId"
            })
            return;
        }

        const books = await prisma.book.findMany({
            where: {
                ownerId: { not: String(userId) },
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


export const hanldeGetRentedBooksByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        console.log("userId", userId)
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" })
            return
        }


        const rentedBooks = await prisma.book.findMany({
            where: {
                rentedById: String(userId),
                status: "RENTED"
            },
            include: {
                owner: true,
                rentedBy: true
            }
        })
        if (!rentedBooks) {
            res.status(404).json({ message: "No rented books found" })
            return
        }

        res.status(200).json(rentedBooks)
        return
    } catch (error) {
        console.error("Error fetching rented books:", error)
        res.status(500).json({ error: "Internal server error" })
        return
    }
}

export const handleGetAvailableBooksByOwner = async (req: Request, res: Response) => {
    const { ownerId } = req.query

    if (!ownerId || typeof ownerId !== 'string') {
        res.status(400).json({ error: 'ownerId is required and must be a string' })
        return
    }

    try {
        const books = await prisma.book.findMany({
            where: {
                ownerId,
                status: 'AVAILABLE',
            },
        })

        res.status(200).json(books)
        return
    } catch (error) {
        console.error('Failed to fetch available books:', error)
        res.status(500).json({ error: 'Internal server error' })
        return
    }
}


export const handleExchangeBooks = async (req: Request, res: Response) => {
    const { bookAId, bookBId, userId } = req.body

    if (!bookAId || !bookBId) {
        res.status(400).json({ error: 'Both book IDs are required' })
        return
    }

    try {
        // Fetch both books
        const [bookA, bookB] = await Promise.all([
            prisma.book.findUnique({ where: { id: bookAId } }),
            prisma.book.findUnique({ where: { id: bookBId } }),
        ])

        if (!bookA || !bookB) {
            res.status(404).json({ error: 'One or both books not found' })
            return
        }

        // Exchange logic — update both records
        await Promise.all([
            prisma.book.update({
                where: { id: bookAId },
                data: {
                    exchangedWithId: bookBId,
                    status: 'EXCHANGED',
                },
            }),
            prisma.book.update({
                where: { id: bookBId },
                data: {
                    exchangedWithId: bookAId,
                    status: 'EXCHANGED',
                },
            }),
        ])

        res.status(200).json({ message: 'Books exchanged successfully' })
    } catch (err) {
        console.error('Exchange error:', err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


export const handleGetAllOwnerBooks = async (req: Request, res: Response) => {
    try {
        const { ownerId } = req.query;

        console.log("ownerId: ", ownerId)
        if (!ownerId) {
            res.status(401).json({ error: 'Unauthorized. User not found.' })
            return
        }

        const books = await prisma.book.findMany({
            where: { ownerId: String(ownerId) },
            include: {
                rentedBy: true,
                exchangedWith: true,
                owner: true,
                exchangedBy: true
            },
            orderBy: { createdAt: 'desc' },
        })

        res.json(books)
    } catch (error) {
        console.error('Error fetching owner books:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}



export const handleDeleteBook = async (req: Request, res: Response) => {
    const { id: bookId } = req.params;

    try {
        const book = await prisma.book.findUnique({ where: { id: bookId } });

        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return
        }

        await prisma.book.delete({ where: { id: bookId } });
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const handleUpdateBook = async (req: Request, res: Response) => {
    const { id: bookId } = req.params;
    const { title, author, genre, city, contact, coverImage } = req.body;

    try {
        const book = await prisma.book.findUnique({ where: { id: bookId } });

        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return
        }

        const updatedBook = await prisma.book.update({
            where: { id: bookId },
            data: {
                title,
                author,
                genre,
                city,
                contact,
                coverImage,
            },
        });

        res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const handleGetBookById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
        res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};