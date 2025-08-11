import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-title">BENCOM S.R.L.</h1>
          <nav>
            <ul className="flex gap-6 flex-wrap">
              <li>
                <Link href="/" className="hover:underline">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:underline">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:underline">
                  Nosotros
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-6">{children}</main>
      <footer className="bg-primary text-white text-center p-4">
        &copy; 2025 BENCOM S.R.L. Todos los derechos reservados.
      </footer>
    </div>
  );
}
