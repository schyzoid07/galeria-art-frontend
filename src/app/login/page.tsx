'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const mutation = useMutation({
        mutationFn: async (credentials: any) => {
            // Nota: Aquí llamamos a un endpoint de login que deberías tener en tu BuyerController
            // Si no lo tienes, podemos usar el de búsqueda por email para simularlo por ahora.
            return api.post('api/buyers/login', { json: credentials }).json();
        },
        onSuccess: (user: any) => {
            // 1. Guardamos el objeto completo del usuario en el navegador
            localStorage.setItem('user', JSON.stringify(user));

            // 2. Avisamos al usuario
            alert(`¡Bienvenido de nuevo, ${user.fullName}!`);

            // 3. Redirigimos al catálogo
            router.push('/');

            // 4. Forzamos un refresco para que el Navbar lea el localStorage nuevo
            router.refresh();
        },
        onError: () => {
            alert('Credenciales incorrectas. Intenta de nuevo.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ email, password });
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-stone-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold text-slate-950">Iniciar Sesión</h2>
                    <p className="text-stone-500 mt-2">Accede a tu colección privada</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Email</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Contraseña</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:bg-stone-300"
                    >
                        {mutation.isPending ? 'Validando...' : 'Entrar'}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-stone-500">
                    ¿No tienes cuenta?{' '}
                    <Link href="/registro" className="text-slate-900 font-bold hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}