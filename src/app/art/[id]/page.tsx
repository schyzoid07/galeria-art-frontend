'use client';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Art, Buyer } from '@/types/art';
import { MembershipButton } from '@/components/MembershipButton';
import { ArtDetailField } from '@/components/ArtDetailField';

export default function ArtDetailPage() {
    const { id } = useParams();
    const queryClient = useQueryClient(); // Para refrescar los datos automáticamente
    const [user, setUser] = useState<Buyer | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed.user ? parsed.user : parsed);
            } catch (e) { console.error("Error al cargar usuario", e); }
        }
    }, []);



    // 1. Query para obtener los detalles de la obra
    const { data: art, isLoading, error } = useQuery<Art>({
        queryKey: ['art', id],
        queryFn: () => api.get(`api/arts/${id}`).json<Art>()
    });

    // 2. Mutación para reservar la obra
    const reserveMutation = useMutation({
        mutationFn: () => {
            const storedUser = localStorage.getItem('user');
            const user = storedUser ? JSON.parse(storedUser) : null;
            const buyerId = user?.id;
            return api.patch(`api/arts/${id}/reservar/${buyerId}`).json<Art>()
        },
        onSuccess: (updatedArt) => {
            alert(`¡Éxito! La obra "${updatedArt.nombre}" ha sido reservada.`);
            // Refrescamos los datos de la obra en la interfaz
            queryClient.invalidateQueries({ queryKey: ['art', id] });
        },
        onError: async (err: any) => {
            // Intentamos leer el mensaje de error que configuramos en el Backend
            const errorData = await err.response?.json().catch(() => null);
            alert(errorData || 'Error al procesar la reserva. Inténtalo de nuevo.');
        }
    });

    if (isLoading) return <div className="p-20 text-center font-serif text-2xl">Cargando obra maestra...</div>;
    if (error || !art) return <div className="p-20 text-center">Obra no encontrada o error de conexión.</div>;

    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Visualización de la Imagen */}
                <div className="bg-white p-4 shadow-2xl rotate-1 border border-stone-200">
                    <Image
                        src={art.imagenUrl || 'https://via.placeholder.com/600'}
                        alt={art.nombre}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Información de la Obra */}
                <div className="space-y-10">
                    <div className="border-b border-stone-200 pb-8">
                        <div className="flex justify-between items-start">
                            <h1 className="text-5xl font-serif font-medium text-slate-900 leading-tight">
                                {art.nombre}
                            </h1>
                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${art.estatus === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {art.estatus}
                            </span>
                        </div>
                        <p className="text-2xl font-light text-stone-500 italic font-serif mt-2">
                            por <span className="text-stone-800 not-italic font-medium">{art.artista?.nombre}</span>
                        </p>
                    </div>

                    {/* Especificaciones Dinámicas (Opción 1 que elegiste) */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                        <ArtDetailField label="Género" value={art.genero?.nombre} />
                        <ArtDetailField label="Técnica" value={art.tecnica} />
                        <ArtDetailField label="Estilo" value={art.estilo} />
                        <ArtDetailField label="Material" value={art.material} />
                        <ArtDetailField label="Pureza" value={art.purezaMetal} />
                        <ArtDetailField label="Peso" value={art.peso ? `${art.peso} kg` : undefined} />
                        <ArtDetailField label="Dimensiones" value={
                            art.largo && art.ancho ? `${art.largo}x${art.ancho} cm` : undefined
                        } />
                        <ArtDetailField label="Impresión" value={art.tipoImpresion} />
                        <ArtDetailField label="Papel" value={art.papel} />
                        <ArtDetailField label="Edición" value={art.edicion} />
                        <ArtDetailField label="Arcilla" value={art.tipoArcilla} />
                        <ArtDetailField label="Cocción" value={art.temperaturaCoccion ? `${art.temperaturaCoccion}°C` : undefined} />
                    </div>

                    {/* Lógica de Botones Condicionales */}
                    <div className="mt-12">

                        {!user ? (
                            <Link href="/login" className="block w-full text-center py-5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">
                                Autenticarse para comprar
                            </Link>
                        ) : 'cargo' in user ? (
                            // Lógica para Admin
                            <div className="w-full py-5 bg-stone-100 text-stone-600 text-center text-xs font-bold uppercase tracking-[0.2em] border border-stone-200">
                                Vista de Administrador
                            </div>
                        ) : !user.membresiaPaga ? (
                            // Lógica para Buyer sin membresía

                            <MembershipButton
                                user={user}
                                onSuccess={(updated) => {
                                    localStorage.setItem('user', JSON.stringify(updated));
                                    setUser(updated);
                                }}
                            />
                        ) : art.estatus !== 'Disponible' ? (
                            // Lógica para obra no disponible
                            <button disabled className="w-full py-5 bg-stone-200 text-stone-500 text-xs font-bold uppercase tracking-[0.3em] cursor-not-allowed">
                                Obra ya {art.estatus}
                            </button>
                        ) : (
                            // Lógica para compra final
                            <button
                                onClick={() => reserveMutation.mutate()}
                                disabled={reserveMutation.isPending}
                                className="w-full py-5 bg-slate-950 text-white text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-slate-950 border-2 border-slate-950 transition-all duration-300 shadow-xl"
                            >
                                {reserveMutation.isPending ? 'Procesando Reserva...' : 'Confirmar reserva'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}