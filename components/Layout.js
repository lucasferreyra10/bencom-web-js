// components/Layout.js
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { waLink } from "../lib/wa";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false); // mobile overlay
  const btnRef = useRef(null);
  const firstLinkRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
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
    }
  }, [open]);

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-white relative z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
          {/* LOGO */}
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="Ir al inicio - Seona Deco"
              className="inline-block"
            >
              <div className="flex items-center">
                <Image
                  src="/logoSeona.jpg"
                  alt="Seona Deco"
                  width={48}
                  height={48}
                  priority
                />
              </div>
            </Link>
          </div>
          {/* Nav escritorio */}
          <nav className="hidden md:flex items-center ml-auto space-x-6 text-sm">
            <Link
              href="/"
              className="inline-block px-2 py-1 rounded transform transition hover:shadow-lg hover:-translate-y-0.5 focus:shadow-lg focus:outline-none"
            >
              Inicio
            </Link>
            <Link
              href="/nosotros"
              className="inline-block px-2 py-1 rounded transform transition hover:shadow-lg hover:-translate-y-0.5 focus:shadow-lg focus:outline-none"
            >
              Nosotros
            </Link>
            <Link
              href="/productos"
              className="inline-block px-2 py-1 rounded transform transition hover:shadow-lg hover:-translate-y-0.5 focus:shadow-lg focus:outline-none"
            >
              Productos
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
                    src="/logoSeona.jpg"
                    alt="Seona Deco"
                    width={48}
                    height={48}
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

              {/* Links: mobile */}
              <nav className="flex-1 px-4 py-6">
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      ref={firstLinkRef}
                      href="/"
                      onClick={handleNavClick}
                      className="block text-white px-4 py-3 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/nosotros"
                      onClick={handleNavClick}
                      className="block text-white px-4 py-3 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Nosotros
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/productos"
                      onClick={handleNavClick}
                      className="block text-white px-4 py-3 rounded-lg transform transition hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Productos
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
      </main>

      {/* FOOTER */}
      <footer className="bg-primary text-white body-font">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center sm:flex-row flex-col">
          <Image
            src="/logoSeona.jpg"
            alt="Seona Deco"
            width={100}
            height={100}
            priority
          />
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            {/* WhatsApp */}
            <a
              href={waLink()}
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
              href="https://www.instagram.com/seona.deco/"
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

            {/* Email */}
            <a
              className="ml-3 text-white"
              href="mailto:seonadeco@gmail.com"
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
            &copy; {new Date().getFullYear()} Seona Deco — Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}