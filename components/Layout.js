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

  // const openTelInNewTab = (phone) => {
  //   try {
  //     window.open(`tel:${phone}`, "_blank", "noopener,noreferrer");
  //   } catch {
  //     location.href = `tel:${phone}`;
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-white relative z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
          {/* LOGO */}
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="Ir al inicio - BENCOM S.R.L."
              className="inline-block"
            >
              <div className="flex items-center">
                <Image
                  src="/logoBencom.png"
                  alt="BENCOM S.R.L."
                  width={50}
                  height={15}
                  priority
                />
              </div>
            </Link>
          </div>
          {/* Nav escritorio (con dropdown por hover) */}
          <nav className="hidden md:flex items-center ml-auto space-x-6 text-sm">
            <Link
              href="/"
              className="inline-block px-2 py-1 rounded transform transition hover:shadow-lg hover:-translate-y-0.5 focus:shadow-lg focus:outline-none"
            >
              Inicio
            </Link>
            {/* Servicios: usar "group" para mostrar dropdown en hover/focus-within */}
            <div className="relative group">
              <button
                aria-expanded="false"
                className="inline-flex items-center gap-2 px-2 py-1 rounded transform transition hover:shadow-lg hover:-translate-y-0.5 focus:shadow-lg focus:outline-none"
              >
                Servicios
                {/* caret */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {/* Dropdown: ahora con fondo primario y texto blanco */}
              <div className="absolute left-0 mt-2 w-56 bg-primary text-white rounded shadow-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 z-50">
                <ul className="py-2">
                  <li>
                    <Link
                      href="/servicios/obra-civil-menor"
                      className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Obra civil menor
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servicios/destapaciones"
                      className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Destapaciones
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servicios/demarcacion-vial"
                      className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Demarcación vial
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servicios/pintura-en-altura"
                      className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Pintura en altura
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servicios/herrerias"
                      className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Herrerías
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servicios/equipos-de-frio"
                      className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Equipos de frío
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servicios/innovaciones"
                      className="block px-4 py-2 text-sm text-white transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Innovaciones
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Otros links */}
            <Link
              href="/nosotros"
              className="inline-block px-2 py-1 rounded transform transition hover:shadow-lg hover:-translate-y-0.5 focus:shadow-lg focus:outline-none"
            >
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
              <span className="sr-only">
                {open ? "Cerrar menú" : "Abrir menú"}
              </span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8h16M4 16h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE OVERLAY + BACKDROP */}
        <div
          id="mobile-menu"
          aria-hidden={!open}
          role="dialog"
          aria-modal="true"
          className="md:hidden"
        >
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Panel deslizante */}
          <aside
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform transition-transform duration-300 ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="h-full bg-primary text-white shadow-xl flex flex-col">
              {/* header del panel */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <Link
                  href="/"
                  onClick={handleNavClick}
                  className="inline-block"
                >
                  <Image
                    src="/logoBencom.png"
                    alt="BENCOM S.R.L."
                    width={50}
                    height={15}
                    priority
                  />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  aria-label="Cerrar menú"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Links: mobile - incluye acordeón para Servicios */}
              <nav className="flex-1 px-4 py-6">
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      href="/"
                      onClick={handleNavClick}
                      className="block text-white px-4 py-3 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Inicio
                    </Link>
                  </li>
                  {/* Servicios (acordeón) */}
                  <li>
                    <button
                      onClick={() => setMobileServiciosOpen((v) => !v)}
                      aria-expanded={mobileServiciosOpen}
                      className="w-full text-left flex items-center justify-between text-white px-4 py-3 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90 focus:shadow-lg focus:-translate-y-0.5 focus:bg-primary/90 focus:outline-none"
                    >
                      <span>Servicios</span>
                      <svg
                        className={`w-4 h-4 transform transition-transform ${
                          mobileServiciosOpen ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>

                    {/* contenido del acordeón */}
                    <ul
                      className={`mt-2 ml-4 overflow-hidden transition-all duration-200 ${
                        mobileServiciosOpen
                          ? "max-h-[600px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <li>
                        <Link
                          href="/servicios/obra-civil-menor"
                          onClick={handleNavClick}
                          className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                        >
                          Obra civil menor
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/servicios/destapaciones"
                          onClick={handleNavClick}
                          className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                        >
                          Destapaciones
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/servicios/demarcacion-vial"
                          onClick={handleNavClick}
                          className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                        >
                          Demarcación vial
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/servicios/pintura-en-altura"
                          onClick={handleNavClick}
                          className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                        >
                          Pintura en altura
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/servicios/herrerias"
                          onClick={handleNavClick}
                          className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                        >
                          Herrerías
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/servicios/equipos-de-frio"
                          onClick={handleNavClick}
                          className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                        >
                          Equipos de frío
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/servicios/innovaciones"
                          onClick={handleNavClick}
                          className="block text-white px-4 py-2 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                        >
                          Innovaciones
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* Otros links mobile */}
                  <li>
                    <Link
                      href="/nosotros"
                      onClick={handleNavClick}
                      className="block text-white px-4 py-3 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Nosotros
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </header>


      <main className="flex-grow max-w-6xl mx-auto px-6 py-6 w-full">
        {children}
        {/* ---------- Feature grid: 4 items (2 cols on mobile, 4 cols on desktop) ---------- */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Item 1 */}
          <article className="bg-[#DFDFDF] rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10">
              {/* icon: location pin */}
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 21s8-5.5 8-11a8 8 0 1 0-16 0c0 5.5 8 11 8 11z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-primary text-primary text-primary text-gray-600">Trabajos en CABA y AMBA</h3>
            <p className="text-sm text-gray-600">
              Cobertura en Ciudad Autónoma y Gran Buenos Aires.
            </p>
          </article>

          {/* Item 2 */}
          <article className="bg-[#DFDFDF] rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10">
              {/* icon: shield / guarantee */}
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 2l7 3v5c0 5-3.5 9.8-7 12-3.5-2.2-7-7-7-12V5l7-3z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-primary text-primary">Servicio profesional</h3>
            <p className="text-sm text-gray-600">
              Técnicos capacitados, tiempos de respuesta ágiles y trabajos con
              garantía.
            </p>
          </article>

          {/* Item 3 */}
          <article className="bg-[#DFDFDF] rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10">
              {/* icon: cash */}
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <rect
                  x="2"
                  y="7"
                  width="20"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-primary text-primary">Aceptamos efectivo</h3>
            <p className="text-sm text-gray-600">
              Pago en el momento con efectivo si lo preferís.
            </p>
          </article>

          {/* Item 4 */}
          <article className="bg-[#DFDFDF] rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10">
              {/* icon: card / cuenta corriente */}
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <rect
                  x="2"
                  y="5"
                  width="20"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M2 10h20"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <rect
                  x="6"
                  y="13"
                  width="6"
                  height="2"
                  rx="1"
                  fill="currentColor"
                  opacity="0.15"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-primary text-primary">
              Otros medios de pago
            </h3>
            <p className="text-sm text-gray-600">
              Aceptamos tarjetas y ofrecemos factura / cuenta corriente para
              empresas.
            </p>
          </article>
        </div>
      </section>
      {/* ---------- /Feature grid ---------- */}
      </main>

      {/* FOOTER */}
      <footer className="bg-primary text-white body-font">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center sm:flex-row flex-col">
          <Image
            src="/footerBencom.svg"
            alt="BENCOM S.R.L."
            width={150}
            height={50}
            priority
          />
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/bencomsrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="text-white"
            >
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              className="ml-3"
              href="https://wa.me/+5491127797320"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <img
                src="https://img.icons8.com/m_outlined/512/whatsapp--v2.png"
                alt="WhatsApp"
                className="w-5 h-5 filter invert object-contain"
                width={20}
                height={20}
                loading="lazy"
                decoding="async"
                style={{ minWidth: 20, minHeight: 20 }}
              />
            </a>

            {/* Instagram */}
            <a
              className="ml-3 text-white"
              href="https://instagram.com/bencomsrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>

            {/* Gmail (envelope, en currentColor para mantener estilo) */}
            <a
              className="ml-3 text-white"
              href="mailto:mantenimiento@bencom.com.ar"
              rel="noopener noreferrer"
              aria-label="Email"
              title="Email"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M20 4H4C2.895 4 2 4.895 2 6v12c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </span>
          <p className="text-sm sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4 text-center">
            &copy; {new Date().getFullYear()} BENCOM S.R.L. — Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
