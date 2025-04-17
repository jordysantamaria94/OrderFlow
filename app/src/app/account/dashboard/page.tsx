'use client'

import { deleteOrder, orders } from "@/utils/apiHelper";
import { verifyToken } from "@/utils/authHelper";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function Home() {

    const router = useRouter()

    const [allOrders, setAllOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)

    useEffect(() => {
        if (!verifyToken()) {
            router.push('/auth/login')
        }

        setLoading(true)
        getOrders()
    }, [])


    async function getOrders() {
        await orders()
            .then(data => {
                setAllOrders(data)
                setLoading(false)
            })
            .catch((error: Error) => {
                console.error(error.message)
            })
    }

    async function removeOrder(id: number) {
        await deleteOrder(id)
            .then(data => {
                const newOrders = allOrders.filter((order: any) => order.client.order_id !== id)
                setAllOrders(newOrders)
                setAlert(true)
            })
            .catch((error: Error) => {
                console.log(error.message)
            })
    }

    function formatearFecha(fechaString: string): string {
        const fecha = new Date(fechaString);
      
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        const hora = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');
      
        return `${dia}-${mes}-${año}`;
      }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between mb-4">
                <h2 className="text-3xl font-semibold">Ordenes</h2>
                <div className="w-auto">
                    <Link href="/account/orders/create" className="btn btn-primary">Crear orden</Link>
                </div>
            </div>
            <div className="flex flex-wrap">
                <div className="w-full">
                    {alert ? (<div role="alert" className="alert alert-error mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Orden eliminada exitosamente</span>
                    </div>) : ''}
                </div>
                {allOrders.length === 0 ? (<div className="w-full text-center">
                    <p className="text-xl font-semibold">No hay ninguna orden ha sido registrada</p>
                </div>) : (
                    <div className="w-full shadow">
                        {allOrders.map((order: any) => {
                            return (<div key={order.client.order_id} className="collapse collapse-arrow bg-base-100 border border-base-300">
                                <input type="radio" name="my-accordion-2" />
                                <div className="collapse-title">
                                    #{order.client.order_id} - {order.client.client_name}
                                </div>
                                <div className="collapse-content text-sm">
                                    <p className="mb-2">Correo: {order.client.client_email}</p>
                                    <p className="mb-2">Telefono: {order.client.client_phone}</p>
                                    <p className="mb-2">Fecha: {formatearFecha(order.client.created_at)}</p>
                                    <p className="mb-2">Total: {order.client.total_amount}</p>
                                    <table className="table bg-slate-100 shadow mt-4">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Precio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.products.map((product: any) => {
                                                return (<tr key={product.id}>
                                                    <td>{product.name}</td>
                                                    <td>{product.price}</td>
                                                </tr>)
                                            })}
                                        </tbody>
                                    </table>
                                    <div className="flex justify-end mt-4">
                                        <Link href={`/account/orders/update/${order.client.order_id}`} className="btn btn-primary">Actualizar</Link>
                                        <button className="btn bg-red-600 text-white ml-2 shadow" onClick={() => removeOrder(order.client.order_id)}>Eliminar</button>
                                    </div>
                                </div>
                            </div>)
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}