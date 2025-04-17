'use client'

import Loading from "@/components/loading";
import { useLogged } from "@/context/Context";
import { login } from "@/utils/apiHelper";
import { verifyToken } from "@/utils/authHelper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface LoginForm {
    email: string
    password: string
}

export default function Login() {

    const router = useRouter()
    const { isLogged, setIsLogged } = useLogged()
    const [loading, setLoading] = useState(false)

    const [formLogin, setFormLogin] = useState<LoginForm>({
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
        setFormLogin({
            ...formLogin,
            [name]: value
        })
    }

    async function logIn() {
        setLoading(true)

        await login({ email: formLogin.email, password: formLogin.password })
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
            logIn()
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
                            <h2 className="card-title text-2xl">Ingresar</h2>

                            <div className="form-control">
                                <label className="label">Correo electronico</label>
                                <input type="text" name="email" className="input shadow w-full" placeholder="usuario@dominio.com" onChange={handleChange} value={formLogin.email} />
                            </div>

                            <div className="form-control mt-2">
                                <label className="label">Contraseña</label>
                                <input type="password" name="password" className="input shadow w-full" placeholder="********" onChange={handleChange} value={formLogin.password} />
                            </div>

                            <div className="mt-4">
                                ¿No tienes cuenta?
                                <Link href="/auth/register" className="link link-primary ml-1">Crea una cuenta</Link>
                            </div>

                            <div className="card-actions justify-end mt-4">
                                <button type="submit" className="btn btn-primary">Ingresar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
