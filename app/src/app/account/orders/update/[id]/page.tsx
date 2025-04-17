'use client'

import { clients as allClients, detailOrder, updateOrder } from "@/utils/apiHelper";
import { products as allProducts } from "@/utils/apiHelper";
import { useEffect } from "react";

import { useRouter, useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { verifyToken } from "@/utils/authHelper";
import { useLogged } from "@/context/Context";
import Loading from "@/components/loading";

interface OrderForm {
    clientId: string
}

export default function Home() {

    const router = useRouter()
    const { isLogged, setIsLogged } = useLogged()
    const [loading, setLoading] = useState(false)

    const { id } = useParams()

    const [clients, setClients] = useState([])
    const [products, setProducts] = useState<{ id: number, name: string, price: number, stock: number, isChecked: boolean }[]>([])
    const [totalOrder, setTotalOrder] = useState<number>(0)

    const [formOrder, setFormOrder] = useState<OrderForm>({
        clientId: "",
    });

    useEffect(() => {
        if (!verifyToken()) {
            router.push('/auth/login')
            setIsLogged(false)
        }

        setLoading(true)

        getClients()
        getProducts()
    }, [])

    async function getClients() {
        await allClients()
            .then((data: any) => {
                setClients(data)
            })
            .catch((error: Error) => {
                console.error(error.message)
                setLoading(false)
            })
    }

    async function getProducts() {
        await allProducts()
            .then((data: any) => {
                getOrder(data)
            })
            .catch((error: Error) => {
                console.error(error.message)
                setLoading(false)
            })
    }

    async function getOrder(items: any) {
        await detailOrder(+id!)
            .then((data: any) => {
                setFormOrder({
                    clientId: data.order.client_id
                })

                const prods = items.map((product: any) => ({
                    ...product,
                    isChecked: data.items.find((item: any) => item.product_id === product.id) !== undefined,
                }));

                setProducts(prods)
                getTotal(prods)
            })
            .catch((error: Error) => {
                console.error(error.message)
                setLoading(false)
            })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormOrder({
            ...formOrder,
            [name]: value
        })
    }

    const handleChangeProduct = (isChecked: string, id: number) => {
        products.find(product => product.id === id)!.isChecked = (isChecked === undefined) ? true : !isChecked
        getTotal(products)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {

            setLoading(true)

            await updateOrder(+id!, {
                clientId: formOrder.clientId,
                products: products,
                totalAmount: totalOrder
            })
                .then(data => {
                    router.push('/account/dashboard')
                    setLoading(false)
                })
                .catch((error: Error) => {
                    console.error(error.message)
                    setLoading(false)
                })
        } catch (error) {
            console.log(error)
        }
    }

    function getTotal(items: any) {
        let total = 0
        items.forEach((product: any) => {
            if (product.isChecked) {
                total = total + +product.price
            }
        })
        setTotalOrder(total)
        setLoading(false)
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="mt-4">
            <main className="flex items-center justify-center">
                <div className="card bg-base-200 shadow w-1/2">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <h2 className="card-title text-2xl mb-2">Actualizar orden</h2>

                            <div className="form-control">
                                <label htmlFor="clientId">Cliente</label>
                                <select name="clientId" className="select shadow w-full mt-2" onChange={handleChange} value={formOrder.clientId}>
                                    <option value="">Seleccionar...</option>
                                    {clients.map((client: any) => {
                                        return (
                                            <option key={client.id} value={client.id}>{client.name}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="form-control mt-4">
                                <label htmlFor="products">Productos</label>
                                <table className="table bg-white shadow mt-2">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nombre</th>
                                            <th>Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product: any) => {
                                            return (
                                                <tr key={product.id}>
                                                    <td><input type="checkbox" className="checkbox" onChange={() => handleChangeProduct(product.isChecked, product.id)} checked={product.isChecked} /></td>
                                                    <td>{product.name}</td>
                                                    <td>{product.price}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="form-control mt-4 text-end">
                                <p className="font-bold text-xl">Total: ${totalOrder}</p>
                            </div>

                            <div className="card-actions justify-end mt-4">
                                <button type="submit" className="btn btn-primary">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}