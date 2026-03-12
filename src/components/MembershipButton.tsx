'use client';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Buyer } from '@/types/art';

interface Props {
    user: Buyer;
    onSuccess: (updatedUser: Buyer) => void;
}

export function MembershipButton({ user, onSuccess }: Props) {
    const mutation = useMutation({
        mutationFn: () => api.post(`api/buyers/${user.id}/pay-membership-v2`, {
            json: { metodoPago: "Tarjeta de Crédito" }
        }).json<Buyer>(),

        onSuccess: (updatedUser) => {
            onSuccess(updatedUser);
        }
    });

    return (
        <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !user.activo}
            className="w-full py-5 bg-white border-2 border-amber-600 text-amber-600 font-black uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200"
        >
            {mutation.isPending ? 'Procesando...' : !user.activo ? 'Cuenta Inactiva' : 'Adquirir Credencial Premium — $10'}
        </button>
    );
}