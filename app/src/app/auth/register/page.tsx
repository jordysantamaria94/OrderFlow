'use client'

import { register } from "@/utils/apiHelper";
import { verifyToken } from "@/utils/authHelper";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogged } from "@/context/Context";
import Loading from "@/components/loading";

interface RegisterForm {
    name: string
    email: string
    password: string
}

export default function Register() {

    const router = useRouter()
    const { isLogged, setIsLogged } = useLogged()
    const [loading, setLoading] = useState(false)

    const [formRegister, setFormRegister] = useState<RegisterForm>({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (verifyToken()) {
            router.push('/account/dashboard')
        }
    }, [])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormRegister({
            ...formRegister,
            [name]: value
        })
    }

    async function onRegister() {
        setLoading(true)

        await register({ name: formRegister.name, email: formRegister.email, password: formRegister.password })
            .then(data => {
                localStorage.setItem("token", data.access_token)
                router.push('/account/dashboard')
                setIsLogged(true)

                setLoading(false)
            })
            .catch((error: Error) => {
                console.error(error.message)
                setLoading(false)
            })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            onRegister()
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div className="card bg-base-100 w-96 shadow">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <h2 className="card-title text-2xl">Registrar</h2>

                            <div className="form-control">
                                <label className="label">Nombre completo</label>
                                <input type="text" name="name" className="input shadow w-full" placeholder="Juan Hernandez" onChange={handleChange} value={formRegister.name} />
                            </div>

                            <div className="form-control mt-2">
                                <label className="label">Correo electronico</label>
                                <input type="text" name="email" className="input shadow w-full" placeholder="usuario@dominio.com" onChange={handleChange} value={formRegister.email} />
                            </div>

                            <div className="form-control mt-2">
                                <label className="label">Contraseña</label>
                                <input type="password" name="password" className="input shadow w-full" placeholder="********" onChange={handleChange} value={formRegister.password} />
                            </div>

                            <div className="mt-2">
                                ¿Ya tienes cuenta?
                                <Link href="/auth/login" className="link link-primary ml-1">Ingresar a mi cuenta</Link>
                            </div>

                            <div className="card-actions justify-end mt-2">
                                <button type="submit" className="btn btn-primary">Registrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
