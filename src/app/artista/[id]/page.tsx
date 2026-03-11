'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { Art } from '@/types/art';
import ArtCard from '@/components/ArtCard';

export default function ArtistaPage() {
    const { id } = useParams();
    const { data: allArts, isLoading } = useQuery({
        queryKey: ['arts'],
        queryFn: () => api.get('api/arts').json<Art[]>(),
    });

    const artistaObra = allArts?.find(a => a.artista.id === Number(id));
    const obrasDelArtista = allArts?.filter(a => a.artista.id === Number(id));

    if (isLoading) return <div className="p-20 text-center">Cargando perfil del artista...</div>;
    if (!artistaObra) return <div className="p-20 text-center">Artista no encontrado.</div>;

    const { artista } = artistaObra;

    return (
        <div className="min-h-screen bg-white">
            {/* HEADER DEL ARTISTA */}
            <header className="bg-gray-900 text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl border-4 border-blue-500">
                        {artista.nombre.charAt(0)}
                    </div>
                    <h1 className="text-5xl font-serif font-bold mb-2">{artista.nombre}</h1>
                    <p className="text-blue-400 font-medium tracking-widest uppercase text-sm mb-6">
                        {artista.nacionalidad}
                    </p>
                    <div className="max-w-2xl mx-auto text-gray-300 leading-relaxed italic">
                        {`${artista.biografia}`}
                    </div>
                </div>
            </header>

            {/* ESTADÍSTICAS RÁPIDAS */}
            <div className="border-b">
                <div className="max-w-4xl mx-auto flex justify-around py-8 text-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{obrasDelArtista?.length}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Obras en Galería</p>
                    </div>

                </div>
            </div>

            {/* GALERÍA DEL ARTISTA */}
            <main className="max-w-6xl mx-auto py-16 px-6">
                <h2 className="text-2xl font-bold mb-8 text-center font-serif">Obras Disponibles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {obrasDelArtista?.map((art) => (
                        <ArtCard key={art.id} art={art} />
                    ))}
                </div>
            </main>
        </div>
    );
}