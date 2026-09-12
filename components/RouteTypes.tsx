"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RouteTypes() {
  return (
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
  )
}