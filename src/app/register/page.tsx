'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: ''
    });

    const mutation = useMutation({
        mutationFn: (newBuyer: any) =>
            api.post('api/buyers/register', { json: newBuyer }).json(),
        onSuccess: () => {
            alert('¡Cuenta creada con éxito! Bienvenido a la Galería.');
            router.push('/login');
        },
        onError: (error) => {
            console.error(error);
            alert('Hubo un error en el registro. Verifica si el email ya existe.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-stone-200 p-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-slate-950">Únete a la Galería</h1>
                    <p className="text-stone-500 mt-2">Crea tu perfil de coleccionista.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Nombre Completo</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            placeholder="Ej. Miguel Ángel"
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Correo Electrónico</label>
                        <input
                            required
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            placeholder="tu@email.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Contraseña</label>
                        <input
                            required
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            placeholder="••••••••"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:bg-stone-300"
                    >
                        {mutation.isPending ? 'Creando cuenta...' : 'Registrarme'}
                    </button>
                </form>
            </div>
        </div>
    );
}