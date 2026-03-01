'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Art } from '@/types/art';
import Link from 'next/link';

export default function AdminDashboard() {
    const { data: arts, isLoading } = useQuery({
        queryKey: ['arts'],
        queryFn: () => api.get('api/arts').json<Art[]>(),
    });

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
                <Link
                    href="/admin/nueva-obra"
                    className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                    + Agregar Obra
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Obra</th>
                            <th className="p-4 font-semibold text-gray-600">Artista</th>
                            <th className="p-4 font-semibold text-gray-600">Precio</th>
                            <th className="p-4 font-semibold text-gray-600">Estatus</th>
                            <th className="p-4 font-semibold text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {arts?.map((art) => (
                            <tr key={art.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{art.nombre}</td>
                                <td className="p-4 text-gray-600">{art.artista.nombre}</td>
                                <td className="p-4 font-bold">${art.precioBase}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${art.estatus === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {art.estatus}
                                    </span>
                                </td>
                                <td className="p-4 space-x-2">
                                    <button className="text-blue-600 hover:underline">Editar</button>
                                    <button className="text-red-600 hover:underline">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}