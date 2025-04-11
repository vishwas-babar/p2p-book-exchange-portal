import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Register a new user
export const handleRegisterUser = async (req: Request, res: Response) => {
    const { name, email, mobile, password, role } = req.body;

    console.log("Registering user:", { name, email, mobile, password, role });

    try {
        // check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: "Email already registered" });
            return
        }

        const user = await prisma.user.create({
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
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
};

// Login a user
export const handleLoginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
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
            return
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
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};

