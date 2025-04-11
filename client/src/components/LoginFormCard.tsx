"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import LoginFormSchema, { LoginFormSchema as LoginSchemaType } from "@/schemas/login.schema";
import { BackendUrl } from "@/config";
import Link from "next/link";

export default function LoginFormCard() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginFormSchema),
    });

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            setLoading(true);
            const res = await axios.post(`${BackendUrl}/user/login`, data);

            if (!res.data) throw new Error("Login failed");

            const user = res.data.user;

            localStorage.setItem("user", JSON.stringify(user));
            toast.success("Login successful");
            if (user.role === "OWNER") {
                window.location.href = "/owner/my-books";
            } else if (user.role === "SEEKER") {
                window.location.href = "/home";
            }
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    toast.error("Invalid credentials");
                } else if (err.response?.status === 400) {
                    toast.error("Invalid data");
                } else {
                    toast.error("Something went wrong");
                }
            } else {
                console.error(err);
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-96 mx-auto mt-10 p-4 shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register("password")} />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                    <p className="text-sm text-center">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
