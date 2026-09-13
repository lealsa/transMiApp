"use client"

import { useState } from "react"
import { ArrowLeft, Star, Accessibility, Users, ChevronRight, MapPin, Bike } from "lucide-react"
import { useApp } from "@/lib/AppContext"
import { getStationById, getStationArrivals, STATIONS_DATABASE } from "@/lib/transmilenioData"

export interface StationDetailProps {
  stationId?: string
  stationName?: string
  stationMeta?: string
  onBack: () => void
  onSelectRoute?: (code: string) => void
}

export function StationDetail({
  stationId = "cll26",
  stationName,
  stationMeta,
  onBack,
  onSelectRoute,
}: StationDetailProps) {
  const { language } = useApp()
  const [isFav, setIsFav] = useState(false)

  const isEs = language === "es"

  // Fetch station dynamically or fallback to default
  const stationObj = getStationById(stationId) || STATIONS_DATABASE.find(s => s.id === "cll26")!
  
  const displayName = stationName || stationObj.name
  const displayAddress = stationMeta || `${stationObj.address} • Zona ${stationObj.zone}`
  const arrivals = getStationArrivals(stationObj.id)

  const crowdText = {
    low: isEs ? "Afluencia baja" : "Low crowd",
    medium: isEs ? "Afluencia media" : "Moderate crowd",
    high: isEs ? "Alta afluencia" : "High crowd",
  }[stationObj.crowdLevel]

  const crowdBg = {
    low: "bg-[var(--sage-bg)] text-[var(--sage-text)]",
    medium: "bg-[var(--accent-light)] text-[var(--accent-dark)]",
    high: "bg-[#fce8e6] text-[#c53929]",
  }[stationObj.crowdLevel]

  return (
    <div className="p-4 flex flex-col gap-4 bg-[var(--bg)] text-[var(--ink)] min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 flex-none border-0 rounded-full bg-[var(--surf)] text-[var(--neu7b)] flex items-center justify-center cursor-pointer hover:bg-[var(--surf2)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.75]" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading text-2xl m-0 leading-tight truncate">{displayName}</h2>
          <div className="text-xs text-[var(--neu7)] truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-none text-[var(--accent-dark)]" />
            <span className="truncate">{displayAddress}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsFav(!isFav)}
          aria-label="Favorite"
          className={`w-10 h-10 flex-none border-0 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
            isFav
              ? "bg-[#f6e6c3] text-[#b8873a]"
              : "bg-[var(--surf)] text-[var(--neu6)] hover:bg-[var(--surf2)]"
          }`}
        >
          <Star className={`w-5 h-5 stroke-[2.75] ${isFav ? "fill-[#b8873a]" : ""}`} />
        </button>
      </div>

      {/* Feature Badges */}
      <div className="flex gap-2 flex-wrap">
        {stationObj.accessible && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sage-bg)] text-[var(--sage-text)] px-3 py-1.5 text-xs font-semibold">
            <Accessibility className="w-3.5 h-3.5 stroke-[2.75]" />
            {isEs ? "Accesible (Elevador/Rampa)" : "Accessible"}
          </span>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${crowdBg}`}>
          <Users className="w-3.5 h-3.5 stroke-[2.75]" />
          {crowdText}
        </span>
        {stationObj.isPortal && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surf2)] text-[var(--neu7b)] px-3 py-1.5 text-xs font-semibold">
            <Bike className="w-3.5 h-3.5 stroke-[2.75]" />
            {isEs ? "Cicloparqueadero & Portal" : "Bike Park & Hub"}
          </span>
        )}
      </div>

      {/* Arrivals Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-xl m-0">{isEs ? "Próximas llegadas" : "Next arrivals"}</h3>
          <span className="text-xs text-[var(--neu6)] font-semibold">{isEs ? "En vivo" : "Live"} • {arrivals.length} {isEs ? "rutas" : "routes"}</span>
        </div>
        
        {arrivals.length === 0 ? (
          <div className="p-6 text-center text-[var(--neu7)] text-sm bg-[var(--surf)] rounded-3xl">
            {isEs ? "No hay rutas programadas en este momento." : "No routes scheduled at this time."}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {arrivals.map((a, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectRoute?.(a.line)}
                className="text-left w-full border-0 bg-[var(--surf)] rounded-3xl p-3 px-4 flex items-center gap-3 cursor-pointer hover:bg-[var(--surf2)] transition-colors border border-[var(--border2)]"
              >
                <span
                  className="w-11 h-9 rounded-2xl flex items-center justify-center font-heading text-sm font-semibold flex-none shadow-xs"
                  style={{ backgroundColor: a.bg, color: a.color }}
                >
                  {a.line}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[var(--ink)] truncate">{a.dest}</div>
                  <div className="text-xs text-[var(--neu7)] truncate">{a.type}</div>
                </div>
                <div className="text-right flex-none">
                  <div className="font-heading text-xl text-[var(--accent-dark)] leading-none">{a.mins}</div>
                  <div className="text-[10px] text-[var(--neu6)] uppercase font-semibold">min</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--neu6)] stroke-[2.75]" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

