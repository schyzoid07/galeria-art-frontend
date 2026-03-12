import ky from 'ky';
import { Art, Invoice } from '@/types/art';

export const api = ky.create({

    prefixUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    // Tiempo máximo de espera para la respuesta en ms
    timeout: 10000,

    // Configuraciones comunes
    headers: {
        'Content-Type': 'application/json',
    },

    // Manejo de errores automático
    hooks: {
        beforeRequest: [
            request => {
                // Útil para debug
                console.log(`Enviando petición a: ${request.url}`);
            }
        ],
        afterResponse: [
            async (_request, _options, response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error de la API:', errorData);
                }
            }
        ]
    }
});

export interface UserHistory {
    reservas: Art[];
    facturas: Invoice[];
}

// Historial del usuario: Obras reservadas y Facturas asociadas
export const getUserHistory = (compradorId: number): Promise<UserHistory> => {
    return api.get(`api/invoices/user/${compradorId}`).json();
};