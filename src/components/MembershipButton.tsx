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
        mutationFn: () => api.post(`api/buyers/${user.id}/pay-membership`, {
            json: { metodoPago: "Tarjeta de Crédito" }
        }).text(),
        onSuccess: () => {

            const updatedUser = { ...user, membresiaPaga: true };
            onSuccess(updatedUser);
        }
    });

    return (
        <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full py-5 bg-white border-2 border-amber-600 text-amber-600 font-black uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-white transition-all shadow-xl"
        >
            {mutation.isPending ? 'Procesando...' : 'Adquirir Credencial Premium — $10'}
        </button>
    );
}