'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Artist } from '@/types/art';
import { useRouter } from 'next/navigation';

export default function ArtistasPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: artistas, isLoading } = useQuery({
        queryKey: ['artistas'],
        queryFn: () => api.get('api/artists').json<Artist[]>()
    });

    // Mutación para eliminar
    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`api/artists/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artistas'] });
            alert('Artista eliminado con éxito');
        },
        onError: () => alert('Error al eliminar el artista')
    });

    if (isLoading) return <div className="p-8">Cargando artistas...</div>;

    return (
        <div className="min-h-screen bg-stone-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-serif font-bold text-gray-950">Gestión de Artistas</h1>
                    <button
                        onClick={() => router.push('/admin/artists/nuevo-artista')}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800"
                    >
                        Nuevo Artista
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {artistas?.map(artista => (
                        <div key={artista.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
                            <h3 className="text-lg font-bold text-stone-900">{artista.nombre}</h3>
                            <p className="text-sm text-stone-500 mb-2">{artista.nacionalidad}</p>
                            <p className="text-sm text-stone-700 line-clamp-2 mb-4">{artista.biografia}</p>

                            <div className="flex gap-2">

                                <button
                                    onClick={() => router.push(`/admin/artists/nuevo-artista?id=${artista.id}`)}
                                    className="px-4 py-2 text-sm font-bold text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('¿Estás seguro de eliminar este artista?')) {
                                            deleteMutation.mutate(artista.id);
                                        }
                                    }}
                                    className="px-4 py-2 text-sm font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}