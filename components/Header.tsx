"use client"

import { Bus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bus className="h-6 w-6" />
          <h1 className="text-xl font-bold">TransMilenio</h1>
        </div>
        <Badge variant="secondary" className="bg-accent text-accent-foreground">
          Bogotá
        </Badge>
      </div>
    </header>
  )
}