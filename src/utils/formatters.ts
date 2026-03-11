export const mostrarAnio = (anio: number) => {
    if (anio < 0) return `${Math.abs(anio)} A.C.`;
    return `${anio} D.C.`;
};