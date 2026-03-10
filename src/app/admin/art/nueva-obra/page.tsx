'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Artist, Genre } from '@/types/art';

export default function NuevaObraPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    // 1. Estados para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        precioBase: '',
        estilo: '',
        tecnica: '',
        imagenUrl: '',
        estatus: 'Disponible',
        artistaId: '',
        generoId: ''
    });

    // 2. Cargar datos necesarios para los Selects
    // Nota: Asumo que tienes estos endpoints en tu Java. Si no, avísame.
    const { data: artistas } = useQuery({
        queryKey: ['artistas'],
        queryFn: () => api.get('api/artists').json<Artista[]>()
    });

    const { data: generos } = useQuery({
        queryKey: ['generos'],
        queryFn: () => api.get('api/genres').json<Genero[]>()
    });

    // 3. Mutación para enviar los datos (POST)
    const mutation = useMutation({
        mutationFn: (nuevaObra: any) => {
            return api.post('api/arts', { json: nuevaObra }).json();
        },
        onSuccess: () => {
            // Invalidamos la cache para que el catálogo se actualice solo
            queryClient.invalidateQueries({ queryKey: ['arts'] });
            alert('¡Obra guardada con éxito!');
            router.push('/admin');
        },
        onError: () => {
            alert('Error al guardar la obra. Revisa la consola o los logs de Docker.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Estructuramos el JSON exactamente como lo espera tu Java
        const payload = {
            nombre: formData.nombre,
            precioBase: Number(formData.precioBase),
            estilo: formData.estilo,
            tecnica: formData.tecnica,
            imagenUrl: formData.imagenUrl,
            estatus: formData.estatus,
            fechaCreacion: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            artista: { id: Number(formData.artistaId) },
            genero: { id: Number(formData.generoId) }
        };

        mutation.mutate(payload);
    };

    return (
        <div className="min-h-screen bg-stone-50 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                <h1 className="text-2xl font-serif font-bold text-gray-950 mb-6">Registrar Nueva Obra</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre de la Obra */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Nombre de la Obra</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-slate-900 outline-none"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        />
                    </div>

                    {/* Artista (Select) */}
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Artista</label>
                        <select
                            required
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-slate-900 outline-none bg-white"
                            value={formData.artistaId}
                            onChange={(e) => setFormData({ ...formData, artistaId: e.target.value })}
                        >
                            <option value="">Seleccionar...</option>
                            {artistas?.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                        </select>
                    </div>

                    {/* Género (Select) */}
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Género</label>
                        <select
                            required
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-slate-900 outline-none bg-white"
                            value={formData.generoId}
                            onChange={(e) => setFormData({ ...formData, generoId: e.target.value })}
                        >
                            <option value="">Seleccionar...</option>
                            {generos?.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                        </select>
                    </div>

                    {/* Precio Base */}
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Precio Base ($)</label>
                        <input
                            required
                            type="number"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-slate-900 outline-none"
                            value={formData.precioBase}
                            onChange={(e) => setFormData({ ...formData, precioBase: e.target.value })}
                        />
                    </div>

                    {/* Técnica */}
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Técnica</label>
                        <input
                            required
                            placeholder="Ej: Óleo, Acrílico"
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-slate-900 outline-none"
                            value={formData.tecnica}
                            onChange={(e) => setFormData({ ...formData, tecnica: e.target.value })}
                        />
                    </div>

                    {/* URL de la Imagen */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2">URL de la Imagen</label>
                        <input
                            required
                            type="url"
                            placeholder="https://..."
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-slate-900 outline-none"
                            value={formData.imagenUrl}
                            onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                        />
                    </div>

                    {/* Botones */}
                    <div className="md:col-span-2 flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-6 py-3 rounded-xl border border-stone-200 font-bold text-stone-600 hover:bg-stone-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:bg-stone-400"
                        >
                            {mutation.isPending ? 'Guardando...' : 'Guardar Obra'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}