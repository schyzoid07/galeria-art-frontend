'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterAdminPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        nombre: '',
        apellido: '',
        email: '',
        cargo: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('api/auth/register-admin', { json: formData }).json();
            alert("Administrador registrado exitosamente");
            router.push('/admin/buyers');
        } catch (error) {
            alert("Error al registrar administrador");
            console.log(error)
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
            <div className="max-w-md mx-auto bg-white shadow-sm border border-stone-200 rounded-3xl p-10">
                <h1 className="text-2xl font-serif font-bold text-slate-950 mb-6">Nuevo Administrador</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Nombre</label>
                        <input
                            required
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full p-3 bg-white rounded-xl border border-stone-300 text-slate-950 font-medium focus:ring-2 focus:ring-amber-600 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Apellido</label>
                        <input
                            required
                            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                            className="w-full p-3 bg-white rounded-xl border border-stone-300 text-slate-950 font-medium focus:ring-2 focus:ring-amber-600 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Usuario (Login)</label>
                        <input
                            required
                            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                            className="w-full p-3 bg-white rounded-xl border border-stone-300 text-slate-950 font-medium focus:ring-2 focus:ring-amber-600 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Cargo</label>
                        <input
                            required
                            placeholder="Ej: Gerente de Ventas"
                            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                            className="w-full p-3 bg-white rounded-xl border border-stone-300 text-slate-950 font-medium focus:ring-2 focus:ring-amber-600 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-3 bg-white rounded-xl border border-stone-300 text-slate-950 font-medium focus:ring-2 focus:ring-amber-600 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-950 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all mt-4"
                    >
                        Registrar Admin
                    </button>
                </form>
            </div>
        </div>
    );
}