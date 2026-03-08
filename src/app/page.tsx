'use client';
import { useState } from 'react'; // Paso 1: Importar useState
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ArtCard from '@/components/ArtCard';
import { Art } from '@/types/art';

export default function CatalogPage() {
  const [search, setSearch] = useState(''); // Estado para el buscador

  const { data: arts, isLoading, isError } = useQuery({
    queryKey: ['arts'],
    queryFn: () => api.get('api/arts').json<Art[]>(),
  });

  // Paso 2: Filtrar la lista basada en el input
  const filteredArts = arts?.filter(art =>
    art.nombre.toLowerCase().includes(search.toLowerCase()) ||
    art.artista.nombre.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="text-center p-20">Cargando galería...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Nuestra Colección</h1>
            <p className="text-gray-500">Encuentra la pieza perfecta para tu espacio.</p>
          </div>

          {/* Input de Búsqueda */}
          <div className="relative w-full md:w-80 ">
            <input
              type="text"
              placeholder="Buscar por obra o artista"
              className="w-full pl-4 pr-10 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute right-3 top-2.5">🔍</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-10 px-6">
        {filteredArts && filteredArts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArts.map((art) => (
              <ArtCard key={art.id} art={art} />

            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No se encontraron obras que coincidan con {`"${search}"`}</p>
          </div>
        )}
      </main>
    </div>
  );
}