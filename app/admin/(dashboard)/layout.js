'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Productos', href: '/admin/productos', icon: '📦' },
    { name: 'Servicios', href: '/admin/servicios', icon: '🛠️' },
    { name: 'Nosotros', href: '/admin/nosotros', icon: '🏢' },
  ]

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* Mobile Navbar Overlay (Hamburger) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary text-white z-40 flex items-center justify-between px-4 shadow-md">
        <h1 className="text-xl font-title tracking-wider">PANEL ADMIN</h1>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 focus:outline-none"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          )}
        </button>
      </div>

      {/* Sidebar Profesional */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-primary text-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex h-20 items-center justify-center border-b border-primary-dark bg-primary-dark">
          <h1 className="text-2xl font-title tracking-widest uppercase">BENCOM S.R.L.</h1>
        </div>
        
        <div className="md:hidden h-16 border-b border-primary-dark bg-primary-dark"></div> {/* Mobile spacer */}
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary text-white shadow-md font-medium'
                    : 'text-gray-300 hover:bg-primary-light hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-primary-dark">
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? 'Saliendo...' : 'Cerrar Sesión'}
          </button>
        </div>
      </aside>

      {/* Overlay para cerrar sidebar en mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 pt-16 md:pt-0">
        <header className="hidden md:flex h-20 bg-white shadow-sm items-center px-8 shrink-0">
          <h2 className="text-gray-600 font-medium text-lg">
            Gestor de Contenidos - BENCOM S.R.L.
          </h2>
        </header>

        {/* Contenido de la Página scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
