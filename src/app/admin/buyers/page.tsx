'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Buyer } from '@/types/art';

export default function AdminBuyersPage() {
    const queryClient = useQueryClient();

    // 1. Obtener todos los compradores
    const { data: buyers, isLoading } = useQuery<Buyer[]>({
        queryKey: ['admin-buyers'],
        queryFn: () => api.get('api/buyers').json<Buyer[]>()
    });

    // 2. Mutación para eliminar
    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`api/buyers/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-buyers'] });
            alert("Comprador eliminado correctamente");
        }
    });

    if (isLoading) return <div>Cargando lista de usuarios...</div>;

    return (
        <div className="p-10 pt-32">
            <h1 className="text-2xl font-bold mb-6">Gestión de Compradores</h1>
            <table className="w-full bg-white rounded-lg shadow">
                <thead>
                    <tr className="border-b text-left text-xs uppercase text-stone-400">
                        <th className="p-4">Login</th>
                        <th className="p-4">Nombre</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {buyers?.map(b => (
                        <tr key={b.id} className="border-b hover:bg-stone-50">
                            <td className="p-4 font-bold">{b.login}</td>
                            <td className="p-4">{b.nombre} {b.apellido}</td>
                            <td className="p-4">{b.email}</td>
                            <td className="p-4">
                                <button
                                    onClick={() => confirm('¿Seguro?') && deleteMutation.mutate(b.id)}
                                    className="text-red-500 font-bold text-xs uppercase"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}