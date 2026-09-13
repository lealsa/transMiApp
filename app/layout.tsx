import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '../components/theme-provider'
import { AppProvider } from '../lib/AppContext'
import ServiceWorkerRegister from '../components/ServiceWorkerRegister'
import { BottomNav } from '../components/BottomNav'
import './globals.css'

export const metadata: Metadata = {
  title: 'TrasmiApp — TransMilenio Bogotá',
  description: 'Rutas, llegadas en vivo y avisos del sistema TransMilenio explicados en español claro.',
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
        <meta name="theme-color" content="#c67139" />
        <link rel="icon" href="/placeholder-logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-[var(--bg)] text-[var(--ink)] antialiased min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <ServiceWorkerRegister />
            <div className="flex-1 max-w-md mx-auto w-full flex flex-col relative min-h-screen pb-20">
              {children}
            </div>
            <BottomNav />
          </AppProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

