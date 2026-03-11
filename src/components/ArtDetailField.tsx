interface Props {
    label: string;
    value?: string | number | null;
}

export function ArtDetailField({ label, value }: Props) {
    // Si no hay valor, no renderizamos (para evitar espacios vacíos)
    if (value === null || value === undefined || value === '') return null;

    return (
        <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.25em] block mb-2">
                {label}
            </span>
            <span className="text-lg text-slate-800 font-light border-l-2 border-stone-200 pl-4 block">
                {value}
            </span>
        </div>
    );
}