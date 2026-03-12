'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Invoice } from '@/types/art';
import Link from 'next/link';

// Componente helper para mostrar los detalles
const DetailItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div>
        <p className="text-xs text-stone-500 uppercase tracking-wider">{label}</p>
        <p className="text-base font-medium text-slate-800">{value || 'N/A'}</p>
    </div>
);

export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const { data: invoice, isLoading, error } = useQuery({
        queryKey: ['invoice', id],
        queryFn: () => api.get(`api/invoices/${id}`).json<Invoice>(),
        enabled: !!id, // Solo ejecuta la consulta si el id está presente
    });

    if (isLoading) return <div className="p-8 text-center">Cargando factura...</div>;
    if (error || !invoice) return <div className="p-8 text-center text-red-500">Error al cargar la factura o no se encontró.</div>;

    return (
        <div className="min-h-screen bg-stone-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <Link href="/admin/facturacion" className="text-blue-600 hover:underline">
                        &larr; Volver a Facturación
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-md"
                    >
                        Imprimir Factura
                    </button>
                </div>

                <div className="bg-white p-10 rounded-2xl shadow-lg border border-stone-200">
                    {/* Encabezado */}
                    <div className="flex justify-between items-start pb-6 border-b">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Factura #{invoice.id}</h1>
                            <p className="text-stone-500">
                                Emitida el: {new Date(invoice.fechaVenta).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="text-2xl font-serif font-black tracking-tighter text-slate-900 text-right">
                            MUSEO<span className="text-stone-400">.</span>
                        </div>
                    </div>

                    {/* Detalles del Comprador y Admin */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Comprador</h2>
                            <DetailItem label="Nombre" value={`${invoice.comprador.nombre} ${invoice.comprador.apellido}`} />
                            <DetailItem label="Email" value={invoice.comprador.email} />
                            <DetailItem label="Dirección de Envío" value={invoice.direccionDestino} />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Facturado por</h2>
                            <DetailItem label="Administrador" value={`${invoice.administrador.nombre} ${invoice.administrador.apellido}`} />
                            <DetailItem label="Email" value={invoice.administrador.email} />
                        </div>
                    </div>

                    {/* Tabla de Items */}
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-slate-700 mb-3">Detalles de la Venta</h2>
                        <div className="overflow-x-auto rounded-lg border border-stone-200">
                            <table className="min-w-full">
                                <thead className="bg-stone-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Obra</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Artista</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Precio</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-stone-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{invoice.obra.nombre}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-stone-600">{invoice.obra.artista.nombre}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-stone-800">${invoice.obra.precioBase.toLocaleString('de-DE')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totales */}
                    <div className="mt-8 flex justify-end">
                        <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between text-base">
                                <span className="text-stone-600">Subtotal:</span>
                                <span className="font-medium text-slate-800">${invoice.subtotal.toLocaleString('de-DE')}</span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span className="text-stone-600">IVA (16%):</span>
                                <span className="font-medium text-slate-800">${invoice.iva.toLocaleString('de-DE')}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-3 border-t">
                                <span className="text-slate-900">Total:</span>
                                <span className="text-slate-900">${invoice.total.toLocaleString('de-DE')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
