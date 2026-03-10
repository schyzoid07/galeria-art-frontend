'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Buyer } from '@/types/art';

export default function AdminBuyersPage() {
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBuyers = async () => {
        try {
            // Asegúrate de que el endpoint GET coincida con tu @GetMapping
            const data = await api.get('api/buyers').json<Buyer[]>();
            setBuyers(data);
        } catch (err) {
            console.error("Error cargando compradores:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuyers();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este comprador?")) return;

        try {
            // Esto llamará a tu @DeleteMapping("/{id}")
            await api.delete(`api/buyers/${id}`);
            // Actualizamos la lista local filtrando el eliminado
            setBuyers(buyers.filter(b => b.id !== id));
        } catch (error) {
            alert("Error al intentar eliminar el comprador.");
            console.log(error)
        }
    };

    if (loading) return <div className="p-32 text-center">Cargando lista...</div>;

    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto bg-white shadow-sm border border-stone-200 rounded-3xl p-10">
                <h1 className="text-3xl font-serif font-bold text-slate-950 mb-8">Gestión de Compradores</h1>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-stone-200 text-stone-400 text-[10px] uppercase tracking-widest">
                            <th className="pb-4">Nombre</th>
                            <th className="pb-4">Email</th>
                            <th className="pb-4">Membresía</th>
                            <th className="pb-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {buyers.map((buyer) => (
                            <tr key={buyer.id} className="text-sm">
                                <td className="py-4 font-bold text-slate-900">{buyer.nombre} {buyer.apellido}</td>
                                <td className="py-4 text-stone-600">{buyer.email}</td>
                                <td className="py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${buyer.membresiaPaga ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-500'}`}>
                                        {buyer.membresiaPaga ? 'PREMIUM' : 'BÁSICA'}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(buyer.id)}
                                        className="text-red-500 hover:text-red-700 font-bold text-xs uppercase transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}