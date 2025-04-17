'use client'

import { useLogged } from "@/context/Context"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Navbar() {

    const router = useRouter()
    const { isLogged, setIsLogged } = useLogged()

    function signOut() {
        localStorage.removeItem('token')
        router.push('/auth/login')
        setIsLogged(false)
    }

    return (
        <div className="navbar bg-base-100 shadow-sm flex justify-between">
            <Link href="/" className="btn btn-ghost text-xl">OrderFlow</Link>
            {isLogged && (
                <button className="mr-4 cursor-pointer" onClick={signOut}>Cerrar Sesión</button>
            )}
        </div>
    )
}