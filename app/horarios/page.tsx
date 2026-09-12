"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HorariosPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-md mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Horarios</h1>
        <Card>
          <CardHeader>
            <CardTitle>Horarios de Servicio</CardTitle>
            <CardDescription>Consulta las frecuencias de las rutas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <div>
                <h4 className="font-medium">Ruta Troncal B1</h4>
                <p className="text-sm text-muted-foreground">Cada 3-5 minutos</p>
              </div>
              <Badge variant="outline">Activo</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <div>
                <h4 className="font-medium">Ruta Zonal 15-1</h4>
                <p className="text-sm text-muted-foreground">Cada 10-15 minutos</p>
              </div>
              <Badge variant="outline">Activo</Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}