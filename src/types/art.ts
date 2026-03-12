export interface Artist {
    id: number;
    nombre: string;
    biografia: string;
    nacionalidad: string;
    fechaNacimiento: string;
    fotoUrl: string;
    porcentajeGanancia: number;
    generos: Genre[];
}

export interface Genre {
    id: number;
    nombre: string;
}


// Base (Campos comunes que toda Obra tiene)
// En @/types/art.ts

export type Art = Painting | Sculpture | Orphebrery | Photography | Ceramic;

export interface BaseArt {
    id: number;
    nombre: string;
    precioBase: number;
    fechaCreacion: number;
    estatus: 'Disponible' | 'Reservada' | 'Vendida';
    imagenUrl: string;
    artista: Artist;
    genero: { id: number; nombre: string };
    compradorReserva?: Buyer;
}

export interface Painting extends BaseArt { tecnica: string; estilo: string; }
export interface Sculpture extends BaseArt { material: string; peso: number; largo: number; ancho: number; profundidad: number; }
export interface Orphebrery extends BaseArt { purezaMetal: string; metalBase: string; peso: number; }
export interface Photography extends BaseArt { tipoImpresion: string; papel: string; edicion: string; }
export interface Ceramic extends BaseArt { tipoArcilla: string; temperaturaCoccion: number; }

//para el paylaod de creacion de obra
export type CreateArtDTO = Omit<Art, 'id'>;

export interface User {
    id: number;
    login: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono: string;
    fechaRegistro: string;
    activo: boolean;
    cargo?: string;
}

export interface Buyer extends User {
    datosTarjetaMask: string;
    membresiaPaga: boolean;
    direccionEnvio: string;
    codigoSeguridad?: string;
}

export interface AuthResponse {
    user: User;
    tipo: 'ADMIN' | 'BUYER';
}

export interface Invoice {
    id: number;
    fechaFacturacion: number; // O Date, dependiendo de cómo lo maneje el backend
    total: number;
    obra: Art; // Detalles completos de la obra
    comprador: Buyer; // Detalles completos del comprador
    admin: User; // Detalles completos del administrador que facturó
    codigoSeguridad?: string; // Opcional, podría no estar en la lista general
    direccion?: string; // Opcional
}