"use client"

import { RouteTypes } from "@/components/RouteTypes"

export default function RutasPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Rutas</h1>
        <RouteTypes />
      </main>
    </div>
  )
}