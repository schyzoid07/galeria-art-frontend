'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types/art';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminAdminsPage() {
    const router = useRouter();
    const [admins, setAdmins] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAdmins = async () => {
        try {
            //TODO: verificar que este endpoint exista
            const data = await api.get('api/admins').json<User[]>();
            setAdmins(data);
        } catch (err) {
            console.error("Error cargando admins:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    if (loading) return <div className="p-32 text-center">Cargando administradores...</div>;

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este administrador?")) return;

        try {
             //TODO: verificar que este endpoint exista
            await api.delete(`api/admins/${id}`);
            setAdmins(prev => prev.filter(admin => admin.id !== id));
            alert("Administrador eliminado con éxito.");
        } catch (err) {
            alert("Error al eliminar el administrador.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto bg-white shadow-sm border border-stone-200 rounded-3xl p-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-slate-950">Gestión de Administradores</h1>
                    <Link href="/admin/admins/crear-admin" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">
                        + Nuevo Administrador
                    </Link>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-stone-200 text-stone-400 text-[10px] uppercase tracking-widest">
                            <th className="pb-4">Nombre</th>
                            <th className="pb-4">Email</th>
                            <th className="pb-4">Cargo</th>
                            <th className="pb-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="text-sm">
                                <td className="py-4 font-bold text-slate-900">{admin.nombre} {admin.apellido}</td>
                                <td className="py-4 text-stone-600">{admin.email}</td>
                                <td className="py-4 text-stone-600">{admin.cargo}</td>
                                <td className="py-4 text-right">
                                    <Link
                                        href={`/admin/admins/crear-admin?id=${admin.id}`}
                                        className="text-stone-400 hover:text-slate-900 mx-2"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(admin.id)}
                                        className="font-bold text-red-400 hover:text-red-600 cursor-pointer"
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
