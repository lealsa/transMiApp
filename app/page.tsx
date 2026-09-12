"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { RoutePlanner } from "@/components/RoutePlanner"
import { QuickActions } from "@/components/QuickActions"
import { Alerts } from "@/components/Alerts"

export default function InicioPage() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        <RoutePlanner
          origin={origin}
          destination={destination}
          setOrigin={setOrigin}
          setDestination={setDestination}
        />

        <QuickActions />

        <Alerts />
      </main>
    </div>
  )
}
