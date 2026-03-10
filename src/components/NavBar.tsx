'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types/art';

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const data = localStorage.getItem('user');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                setUser(parsed.user || parsed);
            } catch (error) {
                localStorage.removeItem('user');
                console.log(error)
            }
        }
        setLoading(false);
    }, []);

    // Proteccion de rutas admin
    useEffect(() => {
        if (!loading && pathname?.startsWith('/admin')) {
            if (!user || !user.cargo) {
                router.push('/');
            }
        }
    }, [user, pathname, loading, router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-serif font-black tracking-tighter text-slate-900">
                    MUSEO<span className="text-stone-400">.</span>
                </Link>

                <div className="flex items-center gap-8">
                    <Link href="/" className="text-sm font-bold text-stone-600 hover:text-slate-950 transition-colors">
                        Galería
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-6">

                            {/* Panel Admin: Solo para Admins */}
                            {user.cargo && (
                                <Link href="/admin/buyers" className="text-sm font-bold text-stone-600 hover:text-slate-950 transition-colors">
                                    Panel Admin
                                </Link>
                            )}

                            {/* Mis Obras: Solo para Buyers (cuando no es admin) */}
                            {!user.cargo && (
                                <Link href="/profile/purchases" className="text-sm font-bold text-stone-600 hover:text-slate-950 transition-colors">
                                    Mis Obras
                                </Link>
                            )}

                            <Link href="/profile" className="flex items-center gap-2 group">
                                <div className="w-20 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    {user.nombre?.toUpperCase() || 'USER'}
                                </div>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="bg-stone-50 text-stone-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-bold text-stone-600 hover:text-slate-950 transition-colors">
                                Ingresar
                            </Link>
                            <Link href="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-xs font-bold hover:shadow-lg transition-all">
                                Unirse
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}