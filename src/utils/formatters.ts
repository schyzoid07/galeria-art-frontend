export const mostrarAnio = (fecha: number | string): string => {

    const anio = typeof fecha === 'string' ? parseInt(fecha) : fecha;

    if (isNaN(anio)) return "Fecha desconocida";

    if (anio < 0) return `${Math.abs(anio)} A.C.`;
    return `${anio} D.C.`;
};