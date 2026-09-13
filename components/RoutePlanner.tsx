"use client"

import { CircleDot, MapPin, ArrowUpDown, Search } from "lucide-react"
import { useApp } from "@/lib/AppContext"

interface RoutePlannerProps {
  origin: string
  destination: string
  setOrigin: (value: string) => void
  setDestination: (value: string) => void
  onSearch?: () => void
}

export function RoutePlanner({
  origin,
  destination,
  setOrigin,
  setDestination,
  onSearch,
}: RoutePlannerProps) {
  const { language } = useApp()

  const handleSwap = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  const fromPlaceholder = language === "es" ? "Origen (ej: Portal Suba)" : "Origin (e.g. Portal Suba)"
  const toPlaceholder = language === "es" ? "Destino (ej: Calle 26)" : "Destination (e.g. Calle 26)"
  const searchBtnText = language === "es" ? "Buscar ruta" : "Search route"

  return (
    <div className="bg-[var(--surf)] rounded-[32px] p-4 flex flex-col gap-2.5 shadow-sm border border-[var(--border2)]">
      <div className="flex gap-2.5 items-center">
        <div className="flex-1 flex flex-col gap-2">
          <div className="relative">
            <CircleDot className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--sage-ink)] stroke-[2.75]" />
            <input
              type="text"
              placeholder={fromPlaceholder}
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full h-11 border-box rounded-full border border-[var(--border)] bg-[var(--bg)] pl-10 pr-3.5 text-sm font-medium text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
            />
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--accent)] stroke-[2.75]" />
            <input
              type="text"
              placeholder={toPlaceholder}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full h-11 border-box rounded-full border border-[var(--border)] bg-[var(--bg)] pl-10 pr-3.5 text-sm font-medium text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleSwap}
          aria-label="Swap origin and destination"
          className="w-11 h-11 flex-none border border-[var(--border)] rounded-full bg-[var(--bg)] text-[var(--neu7b)] flex items-center justify-center cursor-pointer hover:bg-[var(--surf2)] transition-colors active:scale-95"
        >
          <ArrowUpDown className="w-4.5 h-4.5 stroke-[2.75]" />
        </button>
      </div>

      <button
        type="button"
        onClick={onSearch}
        className="w-full h-12 border-0 rounded-full bg-[var(--accent)] text-[#f5ead8] font-heading text-base flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--accent-hover)] transition-all active:scale-[0.99] shadow-xs mt-1"
      >
        <Search className="w-4.5 h-4.5 stroke-[2.75]" />
        {searchBtnText}
      </button>

    </div>
  )
}