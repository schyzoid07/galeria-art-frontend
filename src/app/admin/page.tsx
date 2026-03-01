'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Art } from '@/types/art';
import Link from 'next/link';

export default function AdminDashboard() {
    const { data: arts, isLoading, isError } = useQuery({
        queryKey: ['arts'],
        // Aseguramos que usamos la ruta completa como acordamos
        queryFn: () => api.get('api/arts').json<Art[]>(),
    });

    if (isLoading) return <div className="text-center p-20 text-gray-600">Cargando inventario...</div>;
    if (isError) return <div className="text-center p-20 text-red-600">Error al conectar con el backend de Docker.</div>;

    return (
        // CAMBIO 1: Fondo Blanco Hueso (bg-stone-50) para toda la página
        <div className="min-h-screen bg-stone-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-stone-200">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-950">Panel de Gestión</h1>
                        <p className="text-stone-600 mt-1">Administra el inventario de obras de arte.</p>
                    </div>
                    <Link
                        href="/admin/nueva-obra"
                        // CAMBIO 2: Botón Azul Oscuro (bg-slate-900) para Crear Nueva Obra
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 text-sm flex items-center gap-2"
                    >
                        <span>+</span> Agregar Obra
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-stone-100/50 border-b border-stone-100">
                            <tr>
                                <th className="p-5 font-semibold text-xs text-stone-500 uppercase tracking-wider">Obra</th>
                                <th className="p-5 font-semibold text-xs text-stone-500 uppercase tracking-wider">Artista</th>
                                <th className="p-5 font-semibold text-xs text-stone-500 uppercase tracking-wider">Precio</th>
                                <th className="p-5 font-semibold text-xs text-stone-500 uppercase tracking-wider">Estatus</th>
                                <th className="p-5 font-semibold text-xs text-stone-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {arts?.map((art) => (
                                <tr key={art.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="p-5 font-medium text-gray-950">{art.nombre}</td>
                                    <td className="p-5 text-gray-700">{art.artista?.nombre || 'N/A'}</td>
                                    <td className="p-5 font-bold text-gray-900">
                                        {/* Formateo rápido de moneda */}
                                        ${(art.precioBase ?? 0).toLocaleString('en-US')}
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${art.estatus === 'Disponible'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                                            }`}>
                                            {art.estatus}
                                        </span>
                                    </td>
                                    {/* CAMBIO 3: Botones de Acción en lugar de texto */}
                                    <td className="p-5 text-right space-x-2 whitespace-nowrap">
                                        <button
                                            className="bg-sky-50 text-sky-700 px-4 py-2 rounded-lg font-bold text-xs hover:bg-sky-100 transition-colors border border-sky-100 shadow-inner"
                                            onClick={() => alert('Próximamente: Editar: ' + art.nombre)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="bg-rose-50 text-rose-700 px-4 py-2 rounded-lg font-bold text-xs hover:bg-rose-100 transition-colors border border-rose-100 shadow-inner"
                                            onClick={() => alert('Próximamente: Eliminar: ' + art.nombre)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {arts?.length === 0 && (
                        <div className="text-center py-20 text-stone-400">
                            El inventario está vacío. Haz clic en (+ Agregar Obra) para comenzar.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}