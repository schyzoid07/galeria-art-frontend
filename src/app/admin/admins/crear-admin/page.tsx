'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@/types/art';

type AdminDTO = Omit<User, 'id' | 'fechaRegistro' | 'activo'>;

export default function CrearAdminPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState<AdminDTO>({
        login: '',
        nombre: '',
        apellido: '',
        email: '',
        contraseña: '',
        telefono: '',
        cargo: 'ADMIN', // Por defecto
    });

    const { data: adminData } = useQuery({
        queryKey: ['admin', id],
        queryFn: () => api.get(`api/admins/${id}`).json<User>(),
        enabled: isEditMode,
    });

    useEffect(() => {
        if (adminData) {
            setFormData({
                login: adminData.login,
                nombre: adminData.nombre,
                apellido: adminData.apellido,
                email: adminData.email,
                contraseña: '', // La contraseña no se precarga por seguridad
                telefono: adminData.telefono,
                cargo: adminData.cargo || 'ADMIN',
            });
        }
    }, [adminData]);

    const mutation = useMutation<User, Error, AdminDTO>({
        mutationFn: (adminPayload: AdminDTO) => {
            const endpoint = isEditMode ? `api/admins/${id}` : 'api/admins';
            const method = isEditMode ? 'patch' : 'post';
            return api[method](endpoint, { json: adminPayload }).json<User>();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] });
            alert(`Administrador ${isEditMode ? 'actualizado' : 'creado'} con éxito!`);
            router.push('/admin/admins');
        },
        onError: (err) => {
            alert(`Error al ${isEditMode ? 'actualizar' : 'crear'} el administrador.`);
            console.error(err);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = { ...formData, login: formData.email };

        if (isEditMode && !payload.contraseña) {
            // @ts-ignore
            delete payload.contraseña; // No enviar la contraseña si está vacía en modo edición
        }

        mutation.mutate(payload);
    };

    const handleInputChange = (field: keyof AdminDTO, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-stone-50 p-8 pt-32">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                <h1 className="text-2xl font-serif font-bold text-gray-950 mb-6">
                    {isEditMode ? 'Editar Administrador' : 'Crear Nuevo Administrador'}
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-black uppercase mb-2">Nombre</label>
                        <input required type="text" value={formData.nombre} onChange={e => handleInputChange('nombre', e.target.value)} className="w-full p-3 bg-white text-black rounded-xl border border-stone-300" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-black uppercase mb-2">Apellido</label>
                        <input required type="text" value={formData.apellido} onChange={e => handleInputChange('apellido', e.target.value)} className="w-full p-3 bg-white text-black rounded-xl border border-stone-300" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-black uppercase mb-2">Email</label>
                        <input required type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-3 bg-white text-black rounded-xl border border-stone-300" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-black uppercase mb-2">Contraseña</label>
                        <input required={!isEditMode} type="password" placeholder={isEditMode ? 'Dejar en blanco para no cambiar' : ''} value={formData.contraseña} onChange={e => handleInputChange('contraseña', e.target.value)} className="w-full p-3 bg-white text-black rounded-xl border border-stone-300" />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-black uppercase mb-2">Teléfono</label>
                        <input type="tel" value={formData.telefono} onChange={e => handleInputChange('telefono', e.target.value)} className="w-full p-3 bg-white text-black rounded-xl border border-stone-300" />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-black uppercase mb-2">Cargo</label>
                        <input required type="text" value={formData.cargo || ''} onChange={e => handleInputChange('cargo', e.target.value)} className="w-full p-3 bg-white text-black rounded-xl border border-stone-300" />
                    </div>

                    <div className="md:col-span-2 flex gap-4 mt-4">
                        <button type="button" onClick={() => router.back()} className="flex-1 px-6 py-3 rounded-xl border border-stone-200 font-bold text-stone-600 hover:bg-stone-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={mutation.isPending} className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:bg-stone-400">
                            {mutation.isPending ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
