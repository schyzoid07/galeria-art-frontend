'use client';
import { useEffect, useState } from 'react';
import { Buyer } from '@/types/art';
import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

export default function ProfilePage() {
    const [user, setUser] = useState<Buyer | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Buyer>>({});

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setFormData(parsed);
        }
    }, []);

    const updateMutation = useMutation({
        mutationFn: (data: Partial<Buyer>) =>
            api.patch(`api/buyers/${user?.id}`, { json: data }).json<Buyer>(),
        onSuccess: (updatedUser) => {
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setFormData(updatedUser);
            setIsEditing(false);
            alert("Perfil actualizado exitosamente");
        }
    });

    if (!user) return <div className="p-40 text-center">Cargando perfil...</div>;


    const renderInput = (label: string, field: keyof Buyer, type: string = "text") => {
        const value = formData[field];

        const displayValue = typeof value === 'boolean' ? value.toString() : (value || '');

        return (
            <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">{label}</label>
                <input
                    type={type}
                    disabled={!isEditing}
                    value={displayValue}
                    onChange={(e) => {
                        // Si el campo original era booleano, convertimos el input de vuelta a boolean
                        const val = typeof value === 'boolean' ? e.target.value === 'true' : e.target.value;
                        setFormData({ ...formData, [field]: val });
                    }}
                    className="w-full p-3 bg-white rounded-xl border border-stone-300 text-slate-950 font-medium focus:ring-2 focus:ring-amber-600 outline-none transition-all disabled:bg-stone-50 disabled:border-stone-200"
                />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
            <div className="max-w-2xl mx-auto bg-white shadow-sm border border-stone-200 rounded-3xl p-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-slate-950">Mi Perfil</h1>
                    <button
                        onClick={() => isEditing ? updateMutation.mutate(formData) : setIsEditing(true)}
                        className={`text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full transition-all ${isEditing ? 'bg-amber-600 text-white shadow-lg' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                    >
                        {updateMutation.isPending ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Editar Datos'}
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {renderInput("Nombre", "nombre")}
                        {renderInput("Apellido", "apellido")}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {renderInput("Usuario", "login")}
                        {renderInput("Contraseña", "contraseña", "password")}
                    </div>

                    {renderInput("Email", "email", "email")}
                    {renderInput("Teléfono", "telefono", "tel")}
                    {renderInput("Dirección de Envío", "direccionEnvio")}
                    {renderInput("Tarjeta (Máscara)", "datosTarjetaMask")}

                    {/* Campos de Solo Lectura */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-100">
                        <div>
                            <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Fecha Registro</label>
                            <p className="text-slate-700 font-mono font-medium p-3 bg-stone-50 rounded-xl border border-stone-100">
                                {new Date(user.fechaRegistro).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Estatus Membresía</label>
                            <p className="text-amber-600 font-bold p-3 bg-amber-50 rounded-xl border border-amber-100">
                                {user.membresiaPaga ? "Premium Activa" : "Básica"}
                            </p>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <button onClick={() => { setIsEditing(false); setFormData(user); }} className="mt-8 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-700 underline">
                        Cancelar edición
                    </button>
                )}
            </div>
        </div>
    );
}