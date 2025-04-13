'use client'
import { Button } from "@/components/ui/button"
import { useAuthUser } from "@/hooks/useAuthUser";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TopNavBar() {

    const { ownerStatus, user } = useAuthUser();

    return (
        <header className="w-full px-6 py-3 border-b shadow-sm bg-white sticky top-0 z-50">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                {/* Logo or App Name */}
                <Link href="/books">
                    <h1 className="text-xl font-bold text-primary">Books</h1>
                </Link>

                
                {/* Right-side Button */}
                <div className="flex items-center justify-center gap-4">

                {ownerStatus === 'success' && <Link href="/my-books">
                    <Button variant="default">My Books</Button>
                </Link>}
                <Link href="/my-rented-books">
                    <Button variant="default">My Rented Books</Button>
                </Link>
                </div>
            </div>
        </header>
    )
}
