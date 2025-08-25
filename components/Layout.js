// components/Layout.js
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false); // mobile overlay
  const [mobileServiciosOpen, setMobileServiciosOpen] = useState(false); // mobile sub-menu
  const btnRef = useRef(null);
  const firstLinkRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileServiciosOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstLinkRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      btnRef.current?.focus();
      setMobileServiciosOpen(false);
    }
  }, [open]);

  const handleNavClick = () => {
    setOpen(false);
    setMobileServiciosOpen(false);
  };

  const openTelInNewTab = (phone) => {
    try {
      window.open(`tel:${phone}`, "_blank", "noopener,noreferrer");
    } catch {
      location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/" aria-label="Ir al inicio - BENCOM S.R.L." className="inline-block">
              <div className="flex items-center">
                <Image src="/logoBencom.png" alt="BENCOM S.R.L." width={50} height={15} priority />
              </div>
            </Link>
          </div>

          {/* Nav escritorio (con dropdown por hover) */}
          <nav className="hidden md:flex items-center ml-auto space-x-6 text-sm">
            {/* Servicios: usar "group" para mostrar dropdown en hover/focus-within */}
            <div className="relative group">
              <button
                aria-expanded="false"
                className="inline-flex items-center gap-2 px-2 py-1 rounded transform transition hover:shadow-lg hover:-translate-y-0.5 focus:shadow-lg focus:outline-none"
              >
                Servicios
                {/* caret */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {/* Dropdown: ahora con fondo primario y texto blanco */}
              <div className="absolute left-0 mt-2 w-56 bg-primary text-white rounded shadow-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 z-50">
                <ul className="py-2">
                  <li>
                    <Link href="/servicios#destapaciones" className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90">
                      Destapaciones
                    </Link>
                  </li>
                  <li>
                    <Link href="/servicios#obra-civil-menor" className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90">
                      Obra civil menor
                    </Link>
                  </li>
                  <li>
                    <Link href="/servicios#senalizacion-vial" className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90">
                      Demarcación vial
                    </Link>
                  </li>
                  <li>
                    <Link href="/servicios#herrerias" className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90">
                      Herrerías
                    </Link>
                  </li>
                  <li>
                    <Link href="/servicios#innovaciones" className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90">
                      Innovaciones
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Otros links */}
            <Link href="/nosotros" className="inline-block px-2 py-1 rounded transform transition hover:shadow-lg hover:-translate-y-0.5 focus:shadow-lg focus:outline-none">
              Nosotros
            </Link>

          </nav>

          {/* Botón hamburger (móvil) */}
          <div className="md:hidden ml-auto">
            <button
              ref={btnRef}
              onClick={() => setOpen((v) => !v)}
              aria-controls="mobile-menu"
              aria-expanded={open}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE OVERLAY + BACKDROP */}
        <div id="mobile-menu" aria-hidden={!open} role="dialog" aria-modal="true" className="md:hidden">
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} />

          {/* Panel deslizante */}
          <aside className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
            <div className="h-full bg-primary text-white shadow-xl flex flex-col">
              {/* header del panel */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <Link href="/" onClick={handleNavClick} className="inline-block">
                  <Image src="/logoBencom.png" alt="BENCOM S.R.L." width={50} height={15} priority />
                </Link>
                <button onClick={() => setOpen(false)} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" aria-label="Cerrar menú">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Links: mobile - incluye acordeón para Servicios */}
              <nav className="flex-1 px-4 py-6">
                <ul className="flex flex-col gap-3">
                  {/* Servicios (acordeón) */}
                  <li>
                    <button
                      onClick={() => setMobileServiciosOpen((v) => !v)}
                      aria-expanded={mobileServiciosOpen}
                      className="w-full text-left flex items-center justify-between text-white px-4 py-3 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90 focus:shadow-lg focus:-translate-y-0.5 focus:bg-primary/90 focus:outline-none"
                    >
                      <span>Servicios</span>
                      <svg className={`w-4 h-4 transform transition-transform ${mobileServiciosOpen ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    {/* contenido del acordeón */}
                    <ul className={`mt-2 ml-4 overflow-hidden transition-all duration-200 ${mobileServiciosOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <li>
                        <Link href="/servicios#destapaciones" onClick={handleNavClick} className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90">
                          Destapaciones
                        </Link>
                      </li>
                      <li>
                        <Link href="/servicios#obra-civil-menor" onClick={handleNavClick} className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90">
                          Obra civil menor
                        </Link>
                      </li>
                      <li>
                        <Link href="/servicios#senalizacion-vial" onClick={handleNavClick} className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90">
                          Demarcación vial
                        </Link>
                      </li>
                      <li>
                        <Link href="/servicios#herrerias" onClick={handleNavClick} className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90">
                          Herrerías
                        </Link>
                      </li>
                      <li>
                        <Link href="/servicios#innovaciones" onClick={handleNavClick} className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90">
                          Innovaciones
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* Otros links mobile */}
                  <li>
                    <Link href="/nosotros" onClick={handleNavClick} className="block text-white px-4 py-3 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90">
                      Nosotros
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* footer del panel */}
              <div className="px-4 py-4 border-t border-white/10">
                <a
                  href="tel:+5491127797320"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    openTelInNewTab("+5491127797320");
                    setOpen(false);
                  }}
                  className="block text-white font-medium"
                >
                  Tel: +54 9 11 2779-7320
                </a>

                <a
                  href="mailto:info@bencom.com.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/90 mt-1"
                  onClick={() => setOpen(false)}
                >
                  info@bencom.com.ar
                </a>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-6 py-6 w-full">{children}</main>

      {/* FOOTER */}
      <footer className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center">
          <div className="mb-2">
            <a
              href="https://wa.me/+5491127797320"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                openTelInNewTab("+5491127797320");
              }}
              className="inline-block mr-4 text-white font-medium"
            >
              Tel: +54 9 11 2779-7320
            </a>

            <a
              href="mailto:info@bencom.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white/90"
            >
              info@bencom.com.ar
            </a>
          </div>

          <div>&copy; {new Date().getFullYear()} BENCOM S.R.L. Todos los derechos reservados.</div>
        </div>
      </footer>
    </div>
  );
}
