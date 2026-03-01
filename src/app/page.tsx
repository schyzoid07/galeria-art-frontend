'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ArtCard from '@/components/ArtCard';

export default function CatalogPage() {
  const { data: arts, isLoading, isError } = useQuery({
    queryKey: ['arts'],
    // Usamos 'api/arts' como me pediste expresamente
    queryFn: () => api.get('api/arts').json<any[]>(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Hubo un problema al cargar la colección. Verifica el contenedor Docker.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-white border-b py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            Colección Galería de Arte
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explora nuestra selección exclusiva de obras maestras, desde pinturas clásicas hasta arte contemporáneo.
          </p>
        </div>
      </header>

      {/* Grid de Obras */}
      <main className="max-w-6xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {arts?.map((art) => (
            <ArtCard key={art.id} art={art} />
          ))}
        </div>

        {arts?.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No hay obras disponibles en este momento.
          </div>
        )}
      </main>
    </div>
  );
}