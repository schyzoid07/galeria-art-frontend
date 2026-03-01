export interface Artista {
    id: number;
    nombre: string;
    nacionalidad: string;
    biografia: string;
    porcentajeGanancia: number;
}

export interface Genero {
    id: number;
    nombre: string;
}

export interface Art {
    id: number;
    nombre: string;      // "La Noche Estrellada"
    precioBase: number;  // 1500
    estatus: string;     // "Disponible"
    estilo: string;
    tecnica: string;
    imagenUrl: string;
    artista: Artista;    // Objeto anidado
    genero: Genero;      // Objeto anidado
}