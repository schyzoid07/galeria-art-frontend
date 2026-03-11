'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ArtCard from '@/components/ArtCard';
import { Art } from '@/types/art';

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'nombre' | 'artista'>('nombre');
  const [genre, setGenre] = useState('');
  const [sortByPrice, setSortByPrice] = useState(false);

  // 1. Cargar géneros dinámicamente (Devuelve objetos {id, nombre})
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: () => api.get('api/genres').json<any[]>()
  });

  // 2. Query principal ajustada a los filtros del backend
  const { data: arts, isLoading } = useQuery({
    queryKey: ['arts', genre, sortByPrice],
    queryFn: () => {
      if (sortByPrice) return api.get('api/arts/sort/price').json<Art[]>();
      if (genre) return api.get(`api/arts/genre/${genre}`).json<Art[]>();
      return api.get('api/arts').json<Art[]>();
    }
  });

  // 3. Filtro en el cliente para búsqueda por nombre o artista
  const filteredArts = arts?.filter(art => {
    const term = search.toLowerCase();
    if (searchType === 'nombre') {
      return art.nombre.toLowerCase().includes(term);
    } else {
      // Accedemos a art.artista.nombre (que vimos en tus logs que existe)
      return art.artista?.nombre.toLowerCase().includes(term);
    }
  });

  if (isLoading) return <div className="p-20 text-center">Cargando galería...</div>;

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif mb-8 text-slate-900">Nuestra Colección</h1>



        {/* BARRA DE FILTROS */}
        <div className="flex flex-wrap items-end gap-8 mb-12 bg-white p-8 rounded-2xl shadow-md border border-stone-300">

          {/* 1. Selector de Búsqueda por Texto */}
          <div className="flex-1 min-w-[350px]">
            <label className="text-xs font-black uppercase tracking-[0.15em] text-stone-900 mb-2 block ml-1">
              Búsqueda Directa
            </label>
            <div className="flex shadow-sm">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="bg-stone-100 border-2 border-stone-800 border-r-0 rounded-l-xl px-4 text-stone-900 font-bold text-sm outline-none cursor-pointer hover:bg-stone-200 transition-colors"
              >
                <option value="nombre">OBRA</option>
                <option value="artista">ARTISTA</option>
              </select>
              <input
                type="text"
                placeholder={`Escribe el nombre del ${searchType}...`}
                className="flex-1 border-2 border-stone-800 rounded-r-xl px-5 py-3 outline-none focus:ring-2 focus:ring-black text-stone-900 font-bold placeholder:text-stone-400 text-base"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* 2. Selector de Género Dinámico */}
          <div className="flex flex-col min-w-[220px]">
            <label className="text-xs font-black uppercase tracking-[0.15em] text-stone-900 mb-2 block ml-1">
              Categoría / Género
            </label>
            <select
              onChange={(e) => {
                setGenre(e.target.value);
                setSortByPrice(false);
              }}
              className="border-2 border-stone-800 rounded-xl px-4 py-3 outline-none bg-white text-stone-900 font-black text-sm cursor-pointer hover:bg-stone-50 transition-all appearance-none shadow-sm"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27black%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
              value={genre}
            >
              <option value="">TODOS LOS GÉNEROS</option>
              {genres?.map((g) => (
                <option key={g.id} value={g.nombre} className="font-bold">
                  {g.nombre.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Botón de Ordenar por Precio */}
          <div className="flex flex-col min-w-[200px]">
            <label className="text-xs font-black uppercase tracking-[0.15em] text-stone-900 mb-2 block ml-1 text-center">
              Precios
            </label>
            <button
              onClick={() => {
                setSortByPrice(!sortByPrice);
                setGenre('');
              }}
              className={`px-6 py-[13px] rounded-xl font-black text-sm uppercase tracking-tighter transition-all border-2 shadow-sm ${sortByPrice
                  ? 'bg-black text-white border-black shadow-lg translate-y-[-2px]'
                  : 'bg-white border-stone-800 text-stone-900 hover:bg-black hover:text-white'
                }`}
            >
              {sortByPrice ? '↑ Menor a Mayor' : 'Ordenar por Precio'}
            </button>
          </div>
        </div>

        {/* GRILLA DE RESULTADOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArts?.map(art => (
            <ArtCard key={art.id} art={art} />
          ))}
        </div>

        {filteredArts?.length === 0 && (
          <p className="text-center text-stone-400 py-20">No se encontraron obras con esos criterios.</p>
        )}
      </div>
    </div>
  );
}