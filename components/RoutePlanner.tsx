"use client"

import { MapPin, Navigation, Search, Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface RoutePlannerProps {
  origin: string
  destination: string
  setOrigin: (value: string) => void
  setDestination: (value: string) => void
}

export function RoutePlanner({ origin, destination, setOrigin, setDestination }: RoutePlannerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-balance">
          <Route className="h-5 w-5 text-primary" />
          Planifica tu viaje
        </CardTitle>
        <CardDescription>Encuentra la mejor ruta para tu destino</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Desde..."
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Hasta..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button className="w-full" size="lg">
          <Search className="mr-2 h-4 w-4" />
          Buscar ruta
        </Button>
      </CardContent>
    </Card>
  )
}