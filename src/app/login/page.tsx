'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    // Usamos 'login' para que coincida con tu LoginRequest de Java
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const mutation = useMutation({
        mutationFn: (credentials: any) =>
            api.post('api/auth/login', { json: credentials }).json(),
        onSuccess: (user: any) => {
            console.log("Datos recibidos del back:", user);
            // Guardamos el objeto Buyer que devuelve tu .map(ResponseEntity::ok)
            localStorage.setItem('user', JSON.stringify(user));

            alert(`¡Bienvenido, ${user.nombre}!`);

            router.push('/');
            router.refresh();
        },
        onError: (error: any) => {
            alert('Usuario o contraseña incorrectos');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Enviamos 'login' y 'password' exactamente como espera tu @RequestBody LoginRequest
        mutation.mutate({ login, password });
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-stone-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold text-slate-950 text-center">MUSEO<span className="text-stone-400">.</span></h2>
                    <p className="text-stone-500 mt-2">Ingresa tus credenciales</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Usuario</label>
                        <input
                            required
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full p-3 bg-white rounded-xl border border-stone-300 text-slate-950 font-medium focus:ring-2 focus:ring-amber-600 outline-none transition-all disabled:bg-stone-50 disabled:border-stone-200"
                            placeholder="Tu usuario"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Contraseña</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-white rounded-xl border border-stone-300 text-slate-950 font-medium focus:ring-2 focus:ring-amber-600 outline-none transition-all disabled:bg-stone-50 disabled:border-stone-200"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:bg-stone-300"
                    >
                        {mutation.isPending ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-stone-500">
                    ¿No tienes cuenta?{' '}
                    <Link href="/registro" className="text-slate-900 font-bold hover:underline">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}