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
export interface Art {
    id: number;
    nombre: string;
    precioBase: number;
    fechaCreacion: string;
    estatus: 'Disponible' | 'Reservada' | 'Vendida';
    imagenUrl: string;
    artista: Artist;
    genero: Genre;
}

// Especializaciones (Extienden a Art y añaden sus campos únicos)

export interface Painting extends Art {
    tecnica: string;
    estilo: string;
}

export interface Sculpture extends Art {
    material: string;
    peso: number;
    largo: number;
    ancho: number;
    profundidad: number;
}

export interface Orphebrery extends Art {
    purezaMetal: string;
    metalBase: string;
    peso: number;
}

export interface Photography extends Art {
    tipoImpresion: string;
    papel: string;
    edicion: string;
}

export interface Ceramic extends Art {
    tipoArcilla: string;
    temperaturaCoccion: number;
}

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