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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLoginUser = exports.handleRegisterUser = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// Register a new user
const handleRegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, mobile, password, role } = req.body;
    console.log("Registering user:", { name, email, mobile, password, role });
    try {
        // check if email already exists
        const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: "Email already registered" });
            return;
        }
        const user = yield prisma_1.default.user.create({
            data: {
                name,
                email,
                mobile,
                password,
                role: role, // default to 'user' if no role is provided
            },
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true,
                role: true,
            }
        });
        res.status(201).json({ message: "User registered", user });
    }
    catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
});
exports.handleRegisterUser = handleRegisterUser;
// Login a user
const handleLoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true,
                role: true,
                password: true, // include password for comparison
            }
        });
        if (!user || user.password !== password) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
});
exports.handleLoginUser = handleLoginUser;
