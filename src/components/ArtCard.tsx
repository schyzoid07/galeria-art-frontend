import Image from 'next/image';
import { Art } from '@/types/art';

export default function ArtCard({ art }: { art: Art }) {
    // 1. Protección total: si 'art' no existe, no renderizamos nada
    if (!art) return null;

    // 2. Encadenamiento opcional para el precio
    const precioBase = art?.precioBase ?? 0;

    const precioFormateado = precioBase.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">

            {/* Contenedor de Imagen */}
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <Image
                    src={art?.imagenUrl || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
                    alt={art?.nombre || 'Obra de arte'}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Acceso seguro al nombre del género */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-700 z-10">
                    {art?.genero?.nombre || 'Género'}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                    {art?.nombre || 'Sin título'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    {/* Acceso seguro al nombre del artista */}
                    por <span className="font-medium text-blue-600">{art?.artista?.nombre || 'Autor Desconocido'}</span>
                </p>

                <div className="flex justify-between items-center border-t pt-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Precio Base</p>
                        <p className="text-xl font-black text-gray-900">{precioFormateado}</p>
                    </div>
                    <span className={`text-[10px] uppercase px-2 py-1 rounded-full font-bold ${art?.estatus === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {art?.estatus || 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );
}