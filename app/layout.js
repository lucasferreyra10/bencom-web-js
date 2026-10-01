export const metadata = {
  title: 'BENCOM S.R.L - Admin',
  description: 'Panel de administración',
}

import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
