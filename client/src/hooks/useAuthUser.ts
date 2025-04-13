"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email?: string
  role: "OWNER" | "SEEKER"
}

type OwnerStatus = "loading" | "success" | "failed"

export function useAuthUser({ redirectTo = "/login", protect = true } = {}) {
  const [user, setUser] = useState<User | null>(null)
  const [ownerStatus, setOwnerStatus] = useState<OwnerStatus>("loading")
  const router = useRouter()

  useEffect(() => {
    const localStorageUser = localStorage.getItem("user")

    if (!localStorageUser) {
      if (protect) {
        alert("Please login to continue")
        router.push(redirectTo)
      }
      return
    }

    try {
      const parsedUser: User = JSON.parse(localStorageUser)
      setUser(parsedUser)

      if (parsedUser.role === "OWNER") {
        setOwnerStatus("success")
      } else {
        setOwnerStatus("failed")
      }
    } catch (err) {
      console.error("Error parsing user:", err)
      localStorage.removeItem("user")
      setOwnerStatus("failed")
      if (protect) router.push(redirectTo)
    }
  }, [router, redirectTo, protect])

  return { user, ownerStatus }
}
