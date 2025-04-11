"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { BackendUrl } from "@/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    title: z.string().min(2),
    author: z.string().min(2),
    genre: z.string().optional(),
    city: z.string().min(2),
    contact: z.string().min(6),
});

type FormData = z.infer<typeof formSchema>;

export function AddBookCard({ open = false, setOpen }: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {

    const [user, setUser] = useState({
        id: "123",
        name: "John Doe",
    });
    const router = useRouter();

    useEffect(() => {
      
        const localStorageUser = localStorage.getItem("user");
        if (!localStorageUser) {
            toast.error("Please login to add a book");
            return router.push("/login");
        }
console.log("localStorageUser: ", localStorageUser);
        const parsedUser = JSON.parse(localStorageUser || "");
        setUser(parsedUser);
    }, [])
    

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        console.log("Submitted Book Data:", data);
        try {

            const res = await axios.post(`${BackendUrl}/book/add`, {
                ...data,
                userId: user.id,
            })
            setOpen(false);
            toast.success("Book added successfully!");
            reset();
        } catch (error) {
            console.error("Error adding book:", error);

        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* <DialogTrigger asChild>
        <Button>Create New Book</Button>
      </DialogTrigger> */}

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Book</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <Input {...register("title")} placeholder="Book Title" />
                        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Author</label>
                        <Input {...register("author")} placeholder="Book Author" />
                        {errors.author && <p className="text-sm text-red-500">{errors.author.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Genre</label>
                        <Input {...register("genre")} placeholder="e.g. Self-help, Fiction..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">City</label>
                        <Input {...register("city")} placeholder="e.g. Mumbai" />
                        {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Contact</label>
                        <Input {...register("contact")} placeholder="Phone, Email, etc." />
                        {errors.contact && <p className="text-sm text-red-500">{errors.contact.message}</p>}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">Add Book</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
