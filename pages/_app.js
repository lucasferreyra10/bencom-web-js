import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { Inter, Roboto, Anton } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const roboto = Roboto({ subsets: ['latin'], weight: ['400','700'], variable: '--font-sans' })
const anton = Anton({ subsets: ['latin'], weight: ['400'], variable: '--font-title' })

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/icons/favicon.ico?v=1" sizes="any" />
      </Head>
      <main className={`${inter.variable} ${roboto.variable} ${anton.variable}`}>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default MyApp
