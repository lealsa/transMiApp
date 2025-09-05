"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Navigation, Clock, Bus, Search, Route, AlertCircle } from "lucide-react"

export default function TransMilenioApp() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Quick Route Planner */}
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

        {/* Quick Actions */}
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

        {/* Route Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-balance">Tipos de rutas</CardTitle>
            <CardDescription>Explora el sistema TransMilenio</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="troncal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="troncal">Troncal</TabsTrigger>
                <TabsTrigger value="zonal">Zonal</TabsTrigger>
                <TabsTrigger value="alimentadora">Alimentadora</TabsTrigger>
              </TabsList>
              <TabsContent value="troncal" className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-chart-1/10 rounded-lg">
                  <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-sm">Rutas Troncales</h4>
                    <p className="text-xs text-muted-foreground">Carriles exclusivos con estaciones principales</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">B1 - Usme</span>
                    <Badge variant="outline" className="text-xs">
                      Activa
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">K9 - Suba</span>
                    <Badge variant="outline" className="text-xs">
                      Activa
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="zonal" className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
                  <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-sm">Rutas Zonales</h4>
                    <p className="text-xs text-muted-foreground">Conectan barrios con el sistema troncal</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">15-1 Fontibón</span>
                    <Badge variant="outline" className="text-xs">
                      Activa
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">A03 Soacha</span>
                    <Badge variant="outline" className="text-xs">
                      Activa
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="alimentadora" className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-chart-3/10 rounded-lg">
                  <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-sm">Rutas Alimentadoras</h4>
                    <p className="text-xs text-muted-foreground">Desde portales hacia barrios periféricos</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">6-2 Portal Norte</span>
                    <Badge variant="outline" className="text-xs">
                      Activa
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">8-1 Portal Sur</span>
                    <Badge variant="outline" className="text-xs">
                      Activa
                    </Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Real-time Alerts */}
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
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button className="flex flex-col items-center gap-1 p-3 text-primary">
            <Bus className="h-5 w-5" />
            <span className="text-xs font-medium">Inicio</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <span className="text-xs">Mapa</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 text-muted-foreground">
            <Route className="h-5 w-5" />
            <span className="text-xs">Rutas</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span className="text-xs">Horarios</span>
          </button>
        </div>
      </nav>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  )
}
