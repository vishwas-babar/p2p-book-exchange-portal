"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetBookById = exports.handleUpdateBook = exports.handleDeleteBook = exports.handleGetAllOwnerBooks = exports.handleExchangeBooks = exports.handleGetAvailableBooksByOwner = exports.hanldeGetRentedBooksByUser = exports.handleUnrentBook = exports.handleMarkBookAsRented = exports.handleGetAvailableBooks = exports.handleAddBook = void 0;
const book_schema_1 = __importDefault(require("../schemas/book.schema"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const handleAddBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { userId } = _a, data = __rest(_a, ["userId"]);
        const parsed = book_schema_1.default.safeParse(data);
        if (!parsed.success) {
            console.error("Validation errors:", parsed.error.errors);
            res.status(400).json({ error: parsed.error.errors });
            return;
        }
        const book = yield prisma_1.default.book.create({
            data: Object.assign(Object.assign({}, parsed.data), { ownerId: userId }),
        });
        res.status(201).json({ message: "Book added", book });
    }
    catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.handleAddBook = handleAddBook;
const handleGetAvailableBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { city, genre, search, userId } = req.query;
        if (!userId) {
            res.status(401).json({
                message: "please provide the current userId"
            });
            return;
        }
        const books = yield prisma_1.default.book.findMany({
            where: Object.assign(Object.assign(Object.assign({ ownerId: { not: String(userId) }, status: { in: ['AVAILABLE', 'RENTED'] } }, (city && { city: { equals: String(city), mode: 'insensitive' } })), (genre && { genre: { equals: String(genre), mode: 'insensitive' } })), (search && {
                OR: [
                    { title: { contains: String(search), mode: 'insensitive' } },
                    { author: { contains: String(search), mode: 'insensitive' } },
                ],
            })),
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
        });
        res.status(200).json(books);
    }
    catch (error) {
        console.error('Error fetching available books with filters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.handleGetAvailableBooks = handleGetAvailableBooks;
const handleMarkBookAsRented = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId, rentedById } = req.body;
    if (!bookId || !rentedById) {
        res.status(400).json({ message: 'bookId and rentedById are required' });
        return;
    }
    try {
        // Check if book exists and is available
        const book = yield prisma_1.default.book.findUnique({ where: { id: bookId } });
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        if (book.status !== 'AVAILABLE') {
            res.status(400).json({ message: 'Book is not available for rent' });
            return;
        }
        // Update the book
        const updatedBook = yield prisma_1.default.book.update({
            where: { id: bookId },
            data: {
                status: 'RENTED',
                rentedById: rentedById,
            },
        });
        res.status(200).json({ message: 'Book rented successfully', book: updatedBook });
        return;
    }
    catch (error) {
        console.error('Error marking book as rented:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});
exports.handleMarkBookAsRented = handleMarkBookAsRented;
const handleUnrentBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId, userId } = req.body;
    if (!bookId || !userId) {
        res.status(400).json({ message: "bookId and userId are required" });
        return;
    }
    try {
        const book = yield prisma_1.default.book.findUnique({ where: { id: bookId } });
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        if (book.status !== "RENTED") {
            res.status(400).json({ message: "Book is not currently rented" });
            return;
        }
        if (book.rentedById !== userId) {
            res.status(403).json({ message: "You are not the one who rented this book" });
            return;
        }
        const updatedBook = yield prisma_1.default.book.update({
            where: { id: bookId },
            data: {
                status: "AVAILABLE",
                rentedById: null,
            },
        });
        res.status(200).json({ message: "Book unrented successfully", book: updatedBook });
    }
    catch (error) {
        console.error("Error un-renting book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.handleUnrentBook = handleUnrentBook;
const hanldeGetRentedBooksByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        console.log("userId", userId);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const rentedBooks = yield prisma_1.default.book.findMany({
            where: {
                rentedById: String(userId),
                status: "RENTED"
            },
            include: {
                owner: true,
                rentedBy: true
            }
        });
        if (!rentedBooks) {
            res.status(404).json({ message: "No rented books found" });
            return;
        }
        res.status(200).json(rentedBooks);
        return;
    }
    catch (error) {
        console.error("Error fetching rented books:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
});
exports.hanldeGetRentedBooksByUser = hanldeGetRentedBooksByUser;
const handleGetAvailableBooksByOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ownerId } = req.query;
    if (!ownerId || typeof ownerId !== 'string') {
        res.status(400).json({ error: 'ownerId is required and must be a string' });
        return;
    }
    try {
        const books = yield prisma_1.default.book.findMany({
            where: {
                ownerId,
                status: 'AVAILABLE',
            },
        });
        res.status(200).json(books);
        return;
    }
    catch (error) {
        console.error('Failed to fetch available books:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});
exports.handleGetAvailableBooksByOwner = handleGetAvailableBooksByOwner;
const handleExchangeBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookAId, bookBId, userId } = req.body;
    if (!bookAId || !bookBId) {
        res.status(400).json({ error: 'Both book IDs are required' });
        return;
    }
    try {
        // Fetch both books
        const [bookA, bookB] = yield Promise.all([
            prisma_1.default.book.findUnique({ where: { id: bookAId } }),
            prisma_1.default.book.findUnique({ where: { id: bookBId } }),
        ]);
        if (!bookA || !bookB) {
            res.status(404).json({ error: 'One or both books not found' });
            return;
        }
        // Exchange logic — update both records
        yield Promise.all([
            prisma_1.default.book.update({
                where: { id: bookAId },
                data: {
                    exchangedWithId: bookBId,
                    status: 'EXCHANGED',
                },
            }),
            prisma_1.default.book.update({
                where: { id: bookBId },
                data: {
                    exchangedWithId: bookAId,
                    status: 'EXCHANGED',
                },
            }),
        ]);
        res.status(200).json({ message: 'Books exchanged successfully' });
    }
    catch (err) {
        console.error('Exchange error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.handleExchangeBooks = handleExchangeBooks;
const handleGetAllOwnerBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ownerId } = req.query;
        console.log("ownerId: ", ownerId);
        if (!ownerId) {
            res.status(401).json({ error: 'Unauthorized. User not found.' });
            return;
        }
        const books = yield prisma_1.default.book.findMany({
            where: { ownerId: String(ownerId) },
            include: {
                rentedBy: true,
                exchangedWith: true,
                owner: true,
                exchangedBy: true
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(books);
    }
    catch (error) {
        console.error('Error fetching owner books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.handleGetAllOwnerBooks = handleGetAllOwnerBooks;
const handleDeleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: bookId } = req.params;
    try {
        const book = yield prisma_1.default.book.findUnique({ where: { id: bookId } });
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        yield prisma_1.default.book.delete({ where: { id: bookId } });
        res.status(200).json({ message: "Book deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleDeleteBook = handleDeleteBook;
const handleUpdateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: bookId } = req.params;
    const { title, author, genre, city, contact, coverImage } = req.body;
    try {
        const book = yield prisma_1.default.book.findUnique({ where: { id: bookId } });
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        const updatedBook = yield prisma_1.default.book.update({
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
    }
    catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleUpdateBook = handleUpdateBook;
const handleGetBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const book = yield prisma_1.default.book.findUnique({
            where: { id },
        });
        if (!book) {
            res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    }
    catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleGetBookById = handleGetBookById;
