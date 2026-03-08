'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Buyer } from '@/types/art'; // Importamos el tipo

export default function Navbar() {
    const [user, setUser] = useState<Buyer | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                localStorage.removeItem('user');
                console.log(error)
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
        router.refresh();
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
                            {/* NUEVOS LINKS PARA EL COMPRADOR */}
                            <Link href="/profile/purchases" className="text-sm font-bold text-stone-600 hover:text-slate-950 transition-colors">
                                Mis Obras
                            </Link>

                            <Link href="/profile" className="flex items-center gap-2 group">
                                <div className="w-20 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    {user.nombre + ''}
                                </div>
                                <span className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Perfil</span>
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