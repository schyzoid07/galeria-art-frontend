'use client';

import { useEffect, useState } from 'react';
import { User, Art, Invoice } from '@/types/art';
import { getUserHistory, UserHistory } from '@/lib/api';
import ArtCard from '@/components/ArtCard';
import { useRouter } from 'next/navigation';

export default function PurchasesPage() {
    const [user, setUser] = useState<User | null>(null);
    const [history, setHistory] = useState<UserHistory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                const userObject = parsedUser.user || parsedUser;
                setUser(userObject);
            } catch (e) {
                console.error('Failed to parse user data from localStorage', e);
                localStorage.removeItem('user');
                router.push('/login');
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        if (user?.id) {
            setLoading(true);
            getUserHistory(user.id)
                .then(data => {
                    setHistory(data);
                    setError(null);
                })
                .catch(err => {
                    console.error('Error fetching user history:', err);
                    setError('No se pudo cargar el historial. Inténtalo de nuevo más tarde.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user]);

    const renderArtworks = (artworks: Art[], title: string) => (
        <section>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">{title}</h2>
            {artworks && artworks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {artworks.map(art => (
                        <ArtCard key={art.id} art={art} />
                    ))}
                </div>
            ) : (
                <p className="text-stone-500">No tienes obras en esta categoría.</p>
            )}
        </section>
    );

    const renderInvoices = (invoices: Invoice[], title: string) => (
        <section>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">{title}</h2>
            {invoices && invoices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {invoices.map(invoice => (
                        <div key={invoice.id} className="flex flex-col">
                            <ArtCard art={invoice.obra} />
                            <div className="bg-white p-4 rounded-b-lg shadow-md -mt-1 border-t border-gray-200">
                                <div className="flex justify-between items-baseline">
                                    <p className="text-sm font-bold text-slate-800">Factura #{invoice.id}</p>
                                    <p className="font-semibold text-lg text-slate-900">${invoice.total.toLocaleString()}</p>
                                </div>
                                <p className="text-xs text-stone-500 mt-1">
                                    {new Date(invoice.fechaVenta).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-stone-500">No tienes obras compradas.</p>
            )}
        </section>
    );

    return (
        <div className="bg-stone-50 min-h-screen">
            <main className="max-w-7xl mx-auto px-6 py-24 pt-32">
                <div className="mb-12">
                    <h1 className="text-5xl font-serif font-bold text-slate-900">Mis Obras</h1>
                    <p className="text-lg text-stone-500 mt-2">Aquí puedes ver tus obras reservadas y compradas.</p>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

                {!loading && !error && history && (
                    <div className="space-y-16">
                        {renderArtworks(history.reservas, 'Obras Reservadas')}
                        {renderInvoices(history.facturas, 'Obras Compradas')}
                    </div>
                )}
                {!loading && !error && !history && (
                    <p className="text-stone-500">No se encontró historial para este usuario.</p>
                )}
            </main>
        </div>
    );
}
