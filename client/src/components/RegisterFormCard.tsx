"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RegsiterFormSchema, { RegisterFormSchema } from "@/schemas/register.schema";
import axios from "axios";
import { BackendUrl } from "@/config";
import Link from "next/link";


export default function RegisterFormCard() {
    const [loading, setLoading] = useState(false);


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<RegisterFormSchema>({
        resolver: zodResolver(RegsiterFormSchema),
    });

    const onSubmit = async (data: RegisterFormSchema) => {
        try {
            setLoading(true);
            const res = await axios.post(`${BackendUrl}/user/register`, data);

            if (!res.data) throw new Error("Registration failed");

            const user = res.data.user;

            localStorage.setItem("user", JSON.stringify(user));
            toast.success("Registration successful");
            if (user.role === "OWNER") {
                window.location.href = "/owner/my-books";
            } else if (user.role === "SEEKER") {
                window.location.href = "/home";
            }
        } catch (err: any) {

            if (axios.isAxiosError(err)) {
                // Handle Axios error
                if (err.response?.status === 409) {
                    toast.error("Email already exists!");
                } else if (err.response?.status === 400) {
                    toast.error("Invalid data");
                } else if (err.response?.status === 500) {
                    toast.error("Server error");
                }
            } else {
                // Handle other errors
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
                <CardTitle className="text-2xl">Register</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="mobile">Mobile</Label>
                        <Input id="mobile" {...register("mobile")} />
                        {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register("password")} />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="role">Role</Label>
                        <Select onValueChange={(value) => setValue("role", value as "OWNER" | "SEEKER")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OWNER">Owner</SelectItem>
                                <SelectItem value="SEEKER">Seeker</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Registering..." : "Register"}
                    </Button>

                    <p className="text-sm text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
