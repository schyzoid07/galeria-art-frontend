'use client';
import { useEffect, useState } from 'react';
import { User } from '@/types/art';
import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        // Función para leer el storage
        const loadUserData = () => {
            const stored = localStorage.getItem('user');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    const userData = parsed.user || parsed;
                    setUser(userData);
                    setFormData(userData);
                } catch (e) {
                    console.error("Error al parsear user:", e);
                }
            }
        };

        // 1. Carga inicial
        loadUserData();

        // 2. Escuchar cambios de storage (útil si navegas entre pestañas o componentes)
        window.addEventListener('storage', loadUserData);

        return () => window.removeEventListener('storage', loadUserData);
    }, []); // Sigue siendo [] pero ahora reacciona al evento de ventana

    const isAdmin = user && 'cargo' in user;

    const updateMutation = useMutation({
        mutationFn: (data: any) => {
            const endpoint = isAdmin ? `api/admins/${user?.id}` : `api/buyers/${user?.id}`;
            // DEBUG: Ver qué datos enviamos al servidor
            console.log("DEBUG - Enviando al servidor:", data);
            return api.patch(endpoint, { json: data }).json<any>();
        },
        onSuccess: (updatedUser) => {
            // DEBUG: Confirmar la respuesta del servidor
            console.log("DEBUG - Respuesta del servidor:", updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setFormData(updatedUser);
            setIsEditing(false);
            alert("Perfil actualizado exitosamente");
        }
    });

    if (!user) return <div className="p-40 text-center">Cargando perfil...</div>;


    //Helper para reducir cantidad de codigo en el return de inputs
    const renderInput = (label: string, field: string, type: string = "text") => (
        <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">{label}</label>
            <input
                type={type}
                disabled={!isEditing}
                value={formData[field] || ''}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full p-3 bg-white rounded-xl border border-stone-300 text-slate-950 font-medium focus:ring-2 focus:ring-amber-600 outline-none transition-all disabled:bg-stone-50 disabled:border-stone-200"
            />
        </div>
    );

    const renderReadOnly = (label: string, field: string) => (
        <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">{label}</label>
            <input

                disabled={true} // Siempre deshabilitado
                value={formData[field] || '***'}
                className="w-full p-3 bg-stone-100 rounded-xl border border-stone-200 text-slate-500 font-medium cursor-not-allowed"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
            <div className="max-w-2xl mx-auto bg-white shadow-sm border border-stone-200 rounded-3xl p-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-slate-950">
                        {isAdmin ? "Perfil de Administrador" : "Mi Perfil"}
                    </h1>
                    <button
                        onClick={() => isEditing ? updateMutation.mutate(formData) : setIsEditing(true)}
                        className={`text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full transition-all ${isEditing ? 'bg-amber-600 text-white shadow-lg' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                    >
                        {updateMutation.isPending ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Editar Datos'}
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {renderInput("Nombre", "nombre")}
                        {renderInput("Apellido", "apellido")}
                    </div>
                    {renderInput("Email", "email", "email")}


                    {isAdmin ? (
                        renderInput("Cargo", "cargo")
                    ) : (
                        <>
                            {renderInput("Dirección de Envío", "direccionEnvio")}
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput("Tarjeta (Máscara)", "datosTarjetaMask")}
                                {/* AQUÍ USAMOS EL NUEVO COMPONENTE QUE ES SOLO DE LECTURA */}
                                {renderReadOnly("Código de Seguridad", "codigoSeguridad")}
                            </div>
                        </>
                    )}

                    {/* Botón Cancelar - Solo visible si estamos editando */}
                    {isEditing && (
                        <button
                            onClick={() => { setIsEditing(false); setFormData(user); }}
                            className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-red-500 underline transition-colors"
                        >
                            Cancelar edición
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}