"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bus, MapPin, Route, Clock, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Inicio", icon: Bus },
  { href: "/mapa", label: "Mapa", icon: MapPin },
  { href: "/rutas", label: "Rutas", icon: Route },
  { href: "/horarios", label: "Horarios", icon: Clock },
  { href: "/configuraciones", label: "Config", icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1 p-2 h-auto w-full text-xs",
                pathname === href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  )
}