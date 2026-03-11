'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function FacturacionPage() {
    const [selectedObra, setSelectedObra] = useState<any>(null);
    const [formData, setFormData] = useState({ codigoSeguridad: '', direccion: '' });
    const queryClient = useQueryClient();

    // 1. Obtener solo obras reservadas
    const { data: obrasReservadas } = useQuery({
        queryKey: ['obras-reservadas'],
        queryFn: () => api.get('api/arts/status/Reservada').json<any[]>()
    });

    // 2. Mutación para crear la factura
    const facturarMutation = useMutation({
        mutationFn: (data: any) => api.post('api/invoices/sell', { json: data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['obras-reservadas'] });
            setSelectedObra(null);
            alert('Factura emitida con éxito');
        },
        onError: (e: any) => alert('Error al facturar: ' + e.message)
    });

    const handleFacturar = () => {
        const adminId = localStorage.getItem('adminId'); // Recuperamos el admin del storage
        facturarMutation.mutate({
            obraId: selectedObra.id,
            compradorId: selectedObra.compradorReserva.id,
            adminId: adminId,
            codigoSeguridad: formData.codigoSeguridad,
            direccion: formData.direccion
        });
    };

    return (
        <div className="p-8 bg-stone-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Obras por Facturar</h1>

            <div className="grid gap-4">
                {obrasReservadas?.map((obra) => {
                    console.log("Obra:", obra.nombre, "Comprador:", obra.compradorReserva);
                    return (
                        <div key={obra.id} className="bg-white p-6 rounded-xl border flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{obra.nombre}</h3>
                                <p className="text-sm text-stone-500">Reservado por: {obra.compradorReserva?.nombre}</p>
                            </div>
                            <button
                                onClick={() => setSelectedObra(obra)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                Emitir Factura
                            </button>
                        </div>);
                })}
            </div>

            {/* Modal simple de facturación */}
            {selectedObra && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl w-96">
                        <h2 className="text-lg font-bold mb-4">Emitir Factura: {selectedObra.nombre}</h2>
                        <input className="w-full border p-2 mb-2 rounded" placeholder="Código de Seguridad" onChange={e => setFormData({ ...formData, codigoSeguridad: e.target.value })} />
                        <input className="w-full border p-2 mb-4 rounded" placeholder="Dirección de Envío" onChange={e => setFormData({ ...formData, direccion: e.target.value })} />
                        <div className="flex gap-2">
                            <button onClick={() => setSelectedObra(null)} className="flex-1 border p-2 rounded">Cancelar</button>
                            <button onClick={handleFacturar} className="flex-1 bg-black text-white p-2 rounded">Confirmar Venta</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}