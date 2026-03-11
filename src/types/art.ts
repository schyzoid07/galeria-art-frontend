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
    contraseña: string;
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