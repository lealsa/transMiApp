import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '../components/theme-provider'
import ServiceWorkerRegister from '../components/ServiceWorkerRegister'
import { BottomNav } from '../components/BottomNav'
import './globals.css'

export const metadata: Metadata = {
  title: 'TransMilenio App',
  description: 'App para consultar rutas y horarios de TransMilenio en Bogotá',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0078d4" />
        <link rel="icon" href="/placeholder-logo.png" />
        {/* PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ServiceWorkerRegister />
          {children}
          <BottomNav />
          {/* Bottom padding to account for fixed navigation */}
          <div className="h-20"></div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
