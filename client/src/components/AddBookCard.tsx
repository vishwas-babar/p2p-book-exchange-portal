"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "@/config";
import { toast } from "sonner";
import { useAuthUser } from "@/hooks/useAuthUser";

const formSchema = z.object({
    title: z.string().min(2),
    author: z.string().min(2),
    genre: z.string().optional(),
    city: z.string().min(2),
    contact: z.string().min(6),
    coverImage: z.string().url()
});

type FormData = z.infer<typeof formSchema>;

export function AddBookCard({
    open = false,
    setOpen,
    refetch = () => { },
    editing = false,
    editBookId = "", // book ID for editing
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    refetch?: () => void;
    editing?: boolean;
    editBookId?: string;
}) {
    const { user } = useAuthUser();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    // fetch book data for editing
    useEffect(() => {
        if (open) fetchBook();
    }, [editing, editBookId, open, reset]);


    const fetchBook = async () => {
        if (editing && editBookId) {
            try {
                const res = await axios.get(`${BackendUrl}/book/${editBookId}`);
                const book = res.data;
                reset({
                    title: book.title,
                    author: book.author,
                    genre: book.genre || "",
                    city: book.city,
                    contact: book.contact,
                    coverImage: book.coverImage
                });
            } catch (error) {
                console.error("Failed to fetch book details:", error);
                toast.error("Failed to load book data");
            }
        } else {
            reset(); // reset to empty form when not editing
        }
    };


    const onSubmit = async (data: FormData) => {
        try {
            if (editing) {
                const res = await axios.put(`${BackendUrl}/book/${editBookId}`, {
                    ...data,
                    userId: user?.id,
                });
                toast.success("Book updated successfully!");
            } else {
                const res = await axios.post(`${BackendUrl}/book/add`, {
                    ...data,
                    userId: user?.id,
                });
                toast.success("Book added successfully!");
            }

            setOpen(false);
            reset();
            refetch();
        } catch (error) {
            console.error("Error submitting book:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{editing ? "Edit Book" : "Add New Book"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium">Cover Image</label>
                        <Input {...register("coverImage")} placeholder="Cover Image URL" />
                        {errors.coverImage && <p className="text-sm text-red-500">{errors.coverImage.message}</p>}
                    </div>

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
                        <Button type="submit">{editing ? "Update Book" : "Add Book"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
