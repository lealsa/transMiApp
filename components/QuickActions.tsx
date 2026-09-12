"use client"

import { MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4 text-center">
          <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-sm">Mapa en vivo</h3>
          <p className="text-xs text-muted-foreground">Ver rutas y estaciones</p>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4 text-center">
          <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-sm">Horarios</h3>
          <p className="text-xs text-muted-foreground">Consultar frecuencias</p>
        </CardContent>
      </Card>
    </div>
  )
}