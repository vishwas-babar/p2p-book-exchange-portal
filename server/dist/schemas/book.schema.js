"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Zod schema for validation
const bookSchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    author: zod_1.z.string().min(2),
    genre: zod_1.z.string().optional(),
    city: zod_1.z.string().min(2),
    contact: zod_1.z.string().min(6),
    coverImage: zod_1.z.string().url(),
});
exports.default = bookSchema;
