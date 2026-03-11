'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Genre } from '@/types/art';
import { useRouter } from 'next/navigation';

export default function GenerosPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: generos, isLoading } = useQuery({
        queryKey: ['generos'],
        queryFn: () => api.get('api/genres').json<Genre[]>()
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`api/genres/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['generos'] })
    });

    if (isLoading) return <div className="p-8">Cargando géneros...</div>;

    return (
        <div className="min-h-screen bg-stone-50 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-serif font-bold text-gray-950">Géneros</h1>
                    <button onClick={() => router.push('/admin/generos/nuevo')} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold">Nuevo</button>
                </div>

                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                    {generos?.map(g => (
                        <div key={g.id} className="flex justify-between items-center p-4 border-b border-stone-100 last:border-0">
                            <span className="font-medium text-stone-900">{g.nombre}</span>
                            <div className="flex gap-2">
                                <button onClick={() => router.push(`/admin/generos/editar?id=${g.id}`)} className="text-sm font-bold text-stone-600">Editar</button>
                                <button onClick={() => deleteMutation.mutate(g.id)} className="text-sm font-bold text-red-600">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}