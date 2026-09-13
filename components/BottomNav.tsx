"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bus, MapPin, Route, Clock, Settings } from "lucide-react"
import { useApp } from "@/lib/AppContext"

export function BottomNav() {
  const pathname = usePathname()
  const { language } = useApp()

  const navItems = [
    { href: "/", label: language === "es" ? "Inicio" : "Home", icon: Bus, isCenter: false },
    { href: "/rutas", label: language === "es" ? "Rutas" : "Routes", icon: Route, isCenter: false },
    { href: "/mapa", label: language === "es" ? "Mapa" : "Map", icon: MapPin, isCenter: true },
    { href: "/horarios", label: language === "es" ? "Horarios" : "Schedule", icon: Clock, isCenter: false },
    { href: "/configuraciones", label: language === "es" ? "Config" : "Settings", icon: Settings, isCenter: false },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surf)] border-t border-[var(--border)] px-2 py-1.5 shadow-2xl max-w-md mx-auto">
      <div className="grid grid-cols-5 items-end gap-1 relative">
        {navItems.map(({ href, label, icon: Icon, isCenter }) => {
          const isActive = pathname === href

          if (isCenter) {
            return (
              <Link key={href} href={href} className="no-underline flex justify-center -mt-5">
                <button
                  type="button"
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 border-2 shadow-xl cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-tr from-[#16a34a] to-[#22c55e] text-white border-white scale-110 shadow-emerald-600/40 shadow-lg ring-4 ring-emerald-500/20"
                      : "bg-gradient-to-tr from-[#15803d] to-[#16a34a] text-white border-[var(--surf)] hover:scale-105 shadow-emerald-900/30"
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.75] animate-pulse" />
                  <span className="text-[9.5px] font-bold tracking-tight uppercase mt-0.5">{label}</span>
                </button>
              </Link>
            )
          }

          return (
            <Link key={href} href={href} className="no-underline">
              <button
                type="button"
                className={`w-full flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-2xl transition-all border-0 cursor-pointer ${
                  isActive
                    ? "bg-[var(--bg)] text-[var(--accent-dark)] font-semibold shadow-xs"
                    : "bg-transparent text-[var(--neu6)] hover:bg-[var(--hover)] font-medium"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
                <span className="text-[11px] leading-none tracking-tight">{label}</span>
              </button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
