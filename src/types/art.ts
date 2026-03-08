export interface Artist {
    id: number;
    nombre: string;
    nacionalidad: string;
    biografia: string;
    porcentajeGanancia: number;
}

export interface Genre {
    id: number;
    nombre: string;
}

// Interfaz Base y Especializaciones combinadas
export interface Art {
    // Campos obligatorios (comunes)
    id: number;
    nombre: string;
    precioBase: number;
    fechaCreacion: string;
    estatus: 'Disponible' | 'Reservada' | 'Vendida';
    imagenUrl: string;
    artista: Artist;
    genero: Genre;

    // Campos Opcionales (Especializaciones)
    // Painting
    tecnica?: string;
    estilo?: string;

    // Sculpture & Orphebrery
    material?: string;
    peso?: number;
    largo?: number;
    ancho?: number;
    profundidad?: number;

    // Orphebrery específico
    purezaMetal?: string;
    metalBase?: string;

    // Photograph
    tipoImpresion?: string;
    papel?: string;
    edicion?: string;

    // Ceramic
    tipoArcilla?: string;
    temperaturaCoccion?: number;
}

// src/types/index.ts

export interface User {
    id: number;
    login: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string; // Opcional si puede ser null en DB
    fechaRegistro: string; // LocalDateTime se serializa como ISO string
    activo: boolean;
}

export interface Buyer extends User {
    datosTarjetaMask: string;
    membresiaPaga: boolean;
    direccionEnvio: string;
    codigoSeguridad?: string; // Opcional porque se genera después
}