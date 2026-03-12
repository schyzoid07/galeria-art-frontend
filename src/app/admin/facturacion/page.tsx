'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Art, Invoice } from '@/types/art';
import { User } from '@/types/art';
export default function FacturacionPage() {
    const [selectedObra, setSelectedObra] = useState<any>(null);
    const [formData, setFormData] = useState({ codigoSeguridad: '' });
    const queryClient = useQueryClient();
    const router = useRouter();

    // 1. Obtener solo obras reservadas
    const { data: obrasReservadas, error: obrasReservadasError } = useQuery({
        queryKey: ['obras-reservadas'],
        queryFn: () => api.get('api/arts/status/Reservada').json<Art[]>()
    });

    // 2. Obtener todas las facturas emitidas
    const { data: invoices, isLoading: isLoadingInvoices, error: invoicesError } = useQuery({
        queryKey: ['invoices'],
        queryFn: () => api.get('api/invoices/report').json<Invoice[]>()
    });

    // 2. Mutación para crear la factura
    const facturarMutation = useMutation({
        mutationFn: (data: any) => api.post('api/invoices/sell', { json: data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['obras-reservadas'] });
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            setFormData({ codigoSeguridad: '' }); // Limpiar el formulario
            setSelectedObra(null);
            alert('Factura emitida con éxito');
        },
        onError: (e: any) => alert('Error al facturar: ' + e.message)
    });

    const handleFacturar = () => {
        const storedUser: string | null = localStorage.getItem('user');
        if (!storedUser) {
            alert("No se pudo identificar al administrador. Por favor, inicie sesión de nuevo.");
            return;
        }
        const parsedData = JSON.parse(storedUser);
        const adminId = parsedData?.user?.id;

        if (!adminId) {
            alert("No se pudo identificar al administrador. Por favor, inicie sesión de nuevo.");
            return;
        }

        if (!selectedObra?.compradorReserva?.direccionEnvio) {
            alert("Error: El comprador no tiene una dirección de envío registrada.");
            return;
        }

        facturarMutation.mutate({
            obraId: selectedObra.id,
            compradorId: selectedObra.compradorReserva.id,
            adminId: adminId,
            codigoSeguridad: formData.codigoSeguridad,
            direccion: selectedObra.compradorReserva.direccionEnvio
        });
    };

    if (obrasReservadas === undefined || isLoadingInvoices) return <div className="p-8 bg-stone-50 min-h-screen text-center">Cargando datos...</div>;
    if (obrasReservadasError || invoicesError) return <div className="p-8 bg-stone-50 min-h-screen text-center text-red-600">Error al cargar los datos.</div>;

    return (
        <div className="p-8 bg-stone-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Gestión de Facturación</h1>

            {/* Sección de Obras por Facturar */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-5 text-slate-700">Obras por Facturar</h2>
                {obrasReservadas && obrasReservadas.length > 0 ? (
                    <div className="grid gap-4">
                        {obrasReservadas.map((obra) => (
                            <div key={obra.id} className="bg-white p-6 rounded-xl border flex justify-between items-center shadow-sm">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{obra.nombre}</h3>
                                    <p className="text-sm text-stone-500">Reservado por: <span className="font-medium">{obra.compradorReserva?.nombre} {obra.compradorReserva?.apellido}</span></p>
                                    <p className="text-sm text-stone-500">Precio: <span className="font-medium">${obra.precioBase.toLocaleString()}</span></p>
                                </div>
                                <button
                                    onClick={() => {
                                        setFormData({ codigoSeguridad: '' }); // Resetear al abrir
                                        setSelectedObra(obra);
                                    }}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                                >
                                    Emitir Factura
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-stone-500 bg-white p-6 rounded-xl border shadow-sm">No hay obras reservadas pendientes de facturación.</p>
                )}
            </section>

            {/* Sección de Facturas Emitidas */}
            <section>
                <h2 className="text-2xl font-semibold mb-5 text-slate-700">Facturas Emitidas</h2>
                {invoices && invoices.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {invoices.map((invoice) => (
                            <div key={invoice.id} className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">Factura #{invoice.id}</h3>
                                        <p className="text-sm text-stone-500">
                                            {new Date(invoice.fechaVenta).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-slate-800">${invoice.total.toLocaleString()}</p>
                                </div>
                                <div className="text-sm space-y-1 text-stone-600 border-t pt-3">
                                    <p><strong>Obra:</strong> {invoice.obra?.nombre}</p>
                                    <p><strong>Comprador:</strong> {invoice.comprador?.nombre} {invoice.comprador?.apellido}</p>
                                </div>
                                <div className="mt-auto pt-3">
                                    <button
                                        onClick={() => router.push(`/admin/facturacion/${invoice.id}`)}
                                        className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                                    >
                                        Ver Más Detalles
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-stone-500 bg-white p-6 rounded-xl border shadow-sm">No hay facturas emitidas.</p>
                )}
            </section>

            {/* Modal simple de facturación */}
            {selectedObra && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl w-96">
                        <h2 className="text-lg text-slate-800 font-bold mb-4">Emitir Factura: {selectedObra.nombre}</h2>
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">Dirección de Envío</label>
                            <p className="w-full p-3 bg-stone-100 rounded-lg border border-stone-200 text-stone-700 mt-1">
                                {selectedObra.compradorReserva?.direccionEnvio || 'No especificada'}
                            </p>
                        </div>
                        <input
                            type="text"
                            className="w-full border text-black p-2 mb-4 rounded"
                            placeholder="Código de Seguridad del Comprador"
                            value={formData.codigoSeguridad}
                            onChange={e => setFormData({ ...formData, codigoSeguridad: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <button onClick={() => { setFormData({ codigoSeguridad: '' }); setSelectedObra(null); }} className="flex-1 border p-2 text-black rounded">Cancelar</button>
                            <button onClick={handleFacturar} className=" flex-1 bg-black text-white p-2 rounded">Confirmar Venta</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}