// pages/_app.js
import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import { Inter, Roboto, Anton } from 'next/font/google';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import CartProvider from "../components/CartProvider";

// ✅ CartDrawer solo en cliente (evita SSR para prevenir hydration mismatch)
const CartDrawer = dynamic(() => import("../components/CartDrawer"), { ssr: false });

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const roboto = Roboto({ subsets: ['latin'], weight: ['400','700'], variable: '--font-sans' });
const anton = Anton({ subsets: ['latin'], weight: ['400'], variable: '--font-title' });

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/icons/favicon.ico?v=1" sizes="any" />
      </Head>

      {/* Fonts wrapper */}
      <main className={`${inter.variable} ${roboto.variable} ${anton.variable}`}>
        {/* CartProvider envuelve toda la app para que useCart() funcione en cualquier página */}
        <CartProvider>
          <Component {...pageProps} />
          {/* Drawer flotante del carrito, solo se monta en cliente */}
          <CartDrawer />
        </CartProvider>
      </main>
    </>
  );
}

export default MyApp;
