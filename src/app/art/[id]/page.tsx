'use client';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Art, Buyer, Ceramic, Orphebrery, Painting, Photography, Sculpture } from '@/types/art';
import { MembershipButton } from '@/components/MembershipButton';
import { ArtDetailField } from '@/components/ArtDetailField';
import { mostrarAnio } from '@/utils/formatters';


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
            const parsed = storedUser ? JSON.parse(storedUser) : null;
            const buyerId = parsed?.user?.id || parsed?.id;

            if (!buyerId) throw new Error("No se pudo obtener el ID del comprador");
            return api.post(`api/arts/${id}/reservar/${buyerId}`);
        },
        onSuccess: () => {
            alert(`¡Éxito! La obra ha sido reservada.`);
            queryClient.invalidateQueries({ queryKey: ['art', id] });
            queryClient.invalidateQueries({ queryKey: ['obras-reservadas'] });
        },
        onError: async (err: any) => {
            const errorMessage = await err.response?.text().catch(() => 'Error desconocido');
            alert(errorMessage || 'Error al procesar la reserva. Inténtalo de nuevo.');
        }
    });

    // Mutación para cancelar la reserva de la obra
    const cancelReserveMutation = useMutation({
        mutationFn: () => api.post(`api/arts/${id}/cancelar-reserva`).json<Art>(),
        onSuccess: (updatedArt) => {
            alert(`La reserva de la obra "${updatedArt.nombre}" ha sido cancelada.`);
            queryClient.invalidateQueries({ queryKey: ['art', id] });
            queryClient.invalidateQueries({ queryKey: ['obras-reservadas'] }); // Invalida también en admin
        },
        onError: async (err: any) => {
            const errorMessage = await err.response?.text();
            alert(errorMessage || 'Error al cancelar la reserva. Inténtalo de nuevo.');
        }
    });

    if (isLoading) return <div className="p-20 text-center font-serif text-2xl">Cargando obra maestra...</div>;
    if (error || !art) return <div className="p-20 text-center">Obra no encontrada o error de conexión.</div>;

    // Render para obtener datos especificos del genero

    const renderSpecificDetails = () => {
        const genero = art.genero?.nombre.toLowerCase();

        switch (genero) {
            case 'pintura': {
                const p = art as Painting;
                return (
                    <>
                        <ArtDetailField label="Técnica" value={p.tecnica} />
                        <ArtDetailField label="Estilo" value={p.estilo} />
                    </>
                );
            }
            case 'escultura': {
                const s = art as Sculpture;
                return (
                    <>
                        <ArtDetailField label="Material" value={s.material} />
                        <ArtDetailField label="Peso" value={`${s.peso} kg`} />
                        <ArtDetailField label="Dimensiones" value={`${s.largo}x${s.ancho}x${s.profundidad} cm`} />
                    </>
                );
            }
            case 'orfebreria': {
                const o = art as Orphebrery;
                return (
                    <>
                        <ArtDetailField label="Metal Base" value={o.metalBase} />
                        <ArtDetailField label="Pureza" value={o.purezaMetal} />
                        <ArtDetailField label="Peso" value={`${o.peso} g`} />
                    </>
                );
            }
            case 'fotografia': {
                const ph = art as Photography;
                return (
                    <>
                        <ArtDetailField label="Impresión" value={ph.tipoImpresion} />
                        <ArtDetailField label="Papel" value={ph.papel} />
                        <ArtDetailField label="Edición" value={ph.edicion} />
                    </>
                );
            }
            case 'ceramica': {
                const c = art as Ceramic;
                return (
                    <>
                        <ArtDetailField label="Tipo de Arcilla" value={c.tipoArcilla} />
                        <ArtDetailField label="Temperatura" value={`${c.temperaturaCoccion}°C`} />
                    </>
                );
            }
            default:
                return <p className="text-stone-400">Sin detalles adicionales</p>;
        }
    };

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

                    {/* Especificaciones Dinámicas  */}
                    {/* Especificaciones Dinámicas Limpias */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                        {/* Campos que siempre existen */}
                        <ArtDetailField label="Género" value={art.genero?.nombre} />

                        <ArtDetailField
                            label="Año de Creación"
                            value={mostrarAnio(art.fechaCreacion)}
                        />

                        {/* Campos específicos según el género */}
                        {renderSpecificDetails()}
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
                        ) : !user.activo ? (
                            // Lógica para usuario inactivo
                            <div className="w-full py-5 bg-red-100 text-red-800 text-center text-sm font-semibold uppercase tracking-wider border border-red-200 rounded-lg">
                                Tu cuenta está inactiva. Contacta a soporte para reactivarla.
                            </div>
                        ) : !user.membresiaPaga ? (
                            // Lógica para Buyer sin membresía

                            <MembershipButton
                                user={user}
                                onSuccess={(updated) => {
                                    localStorage.setItem('user', JSON.stringify(updated));
                                    setUser(updated);
                                    alert("¡Pago exitoso! Tu membresía ha sido activada y tu código de seguridad generado.");
                                    console.log("DEBUG - Datos recibidos tras pago:", updated);
                                    queryClient.invalidateQueries({ queryKey: ['art', id] });
                                }}
                            />
                        ) : art.estatus === 'Reservada' && art.compradorReserva?.id === user.id ? (
                            // Lógica para cancelar la reserva si es del usuario actual
                            <button
                                onClick={() => cancelReserveMutation.mutate()}
                                disabled={cancelReserveMutation.isPending}
                                className="w-full py-5 bg-red-600 text-white text-xs font-bold uppercase tracking-[0.3em] hover:bg-red-700 border-2 border-red-600 transition-all duration-300 shadow-xl disabled:bg-red-400"
                            >
                                {cancelReserveMutation.isPending ? 'Cancelando...' : 'Cancelar Reserva'}
                            </button>
                        ) : art.estatus !== 'Disponible' ? ( // Obra no disponible (reservada por otro o vendida)

                            <button disabled className="w-full py-5 bg-stone-200 text-stone-500 text-xs font-bold uppercase tracking-[0.3em] cursor-not-allowed">
                                Obra ya {art.estatus}
                            </button>
                        ) : (
                            // Lógica para reservar la obra
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