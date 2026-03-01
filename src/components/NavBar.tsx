import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="font-serif text-xl font-bold italic">
                    Galería Van Gogh
                </Link>
                <div className="space-x-6 text-sm font-medium">
                    <Link href="/" className="text-gray-600 hover:text-black">Catálogo</Link>
                    <Link href="/admin" className="bg-black text-white px-4 py-2 rounded-lg">Panel Admin</Link>
                </div>
            </div>
        </nav>
    );
}