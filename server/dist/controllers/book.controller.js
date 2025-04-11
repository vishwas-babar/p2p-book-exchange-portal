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
exports.handleAddBook = void 0;
const book_schema_1 = __importDefault(require("../schemas/book.schema"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const handleAddBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { userId } = _a, data = __rest(_a, ["userId"]);
        const parsed = book_schema_1.default.safeParse(data);
        if (!parsed.success) {
            console.error("Validation errors:", parsed.error.errors);
            return res.status(400).json({ error: parsed.error.errors });
        }
        const book = yield prisma_1.default.book.create({
            data: Object.assign(Object.assign({}, parsed.data), { ownerId: userId }),
        });
        return res.status(201).json({ message: "Book added", book });
    }
    catch (error) {
        console.error("Error adding book:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.handleAddBook = handleAddBook;
