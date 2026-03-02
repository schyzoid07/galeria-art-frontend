'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState<{ nombre: string } | null>(null);
    const router = useRouter();

    // Este efecto se ejecuta al cargar la página y detecta al usuario
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parseando usuario", error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
        router.refresh(); // Refresca para limpiar estados
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="text-2xl font-serif font-black tracking-tighter text-slate-900">
                    MUSEO<span className="text-stone-400">.</span>
                </Link>

                {/* LINKS DINÁMICOS */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-sm font-bold text-stone-600 hover:text-slate-950 transition-colors">
                        Galería
                    </Link>

                    {user ? (
                        // VISTA CUANDO EL USUARIO ESTÁ LOGUEADO
                        <div className="flex items-center gap-6">
                            <span className="text-sm font-medium text-stone-400">
                                Hola, <span className="text-slate-900 font-bold">{user?.nombre ? user.nombre.split(' ')[0] : "Usuario"}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-stone-100 text-stone-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-stone-200 transition-all"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        // VISTA CUANDO NO HAY USUARIO
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-bold text-stone-600 hover:text-slate-950 transition-colors">
                                Ingresar
                            </Link>
                            <Link
                                href="/registro"
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-xs font-bold hover:shadow-lg active:scale-95 transition-all"
                            >
                                Unirse
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}