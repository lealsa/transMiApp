"use client"

import { AlertCircle, Clock, Bus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Alerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-balance">
          <AlertCircle className="h-5 w-5 text-accent" />
          Alertas del sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg border-l-4 border-accent">
          <Clock className="h-4 w-4 text-accent mt-0.5" />
          <div>
            <h4 className="font-medium text-sm">Demora en Estación Calle 26</h4>
            <p className="text-xs text-muted-foreground">Retraso de 5 minutos en rutas B1 y K9</p>
            <span className="text-xs text-accent">Hace 2 minutos</span>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
          <Bus className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <h4 className="font-medium text-sm">Servicio normal</h4>
            <p className="text-xs text-muted-foreground">Todas las demás rutas operando con normalidad</p>
            <span className="text-xs text-muted-foreground">Actualizado hace 1 minuto</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}