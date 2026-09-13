"use client"

import { useState } from "react"
import { ChevronRight, ArrowLeft, Clock, Calendar, Search } from "lucide-react"
import { useApp } from "@/lib/AppContext"
import { getRouteByCode, ROUTES_DATABASE } from "@/lib/transmilenioData"
import Link from "next/link"

export function RouteTypes() {
  const { language } = useApp()
  const [selectedType, setSelectedType] = useState<"troncal" | "zonal" | "alimentadora">("troncal")
  const [selectedRouteCode, setSelectedRouteCode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const isEs = language === "es"

  // Route detail view if a route is selected
  if (selectedRouteCode) {
    const routeObj = getRouteByCode(selectedRouteCode) || ROUTES_DATABASE[0]

    return (
      <div className="p-4 flex flex-col gap-4 bg-[var(--bg)] text-[var(--ink)] min-h-full">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedRouteCode(null)}
            className="w-10 h-10 flex-none border-0 rounded-full bg-[var(--surf)] text-[var(--neu7b)] flex items-center justify-center cursor-pointer hover:bg-[var(--surf2)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.75]" />
          </button>
          <span
            className="inline-flex items-center justify-center min-w-[46px] h-8 px-3 rounded-full font-heading text-base text-white flex-none"
            style={{ backgroundColor: routeObj.color || "var(--accent)" }}
          >
            {routeObj.code}
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-heading text-lg leading-tight truncate">{routeObj.name}</div>
            <div className="text-xs text-[var(--neu7)] truncate">
              {routeObj.origin} ➔ {routeObj.destination}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-2.5">
          <div className="flex-1 bg-[var(--surf)] rounded-3xl p-3 px-4 border border-[var(--border2)]">
            <div className="text-[11px] uppercase tracking-wider text-[var(--neu6)]">{isEs ? "Frecuencia Pico" : "Peak Freq"}</div>
            <div className="font-heading text-lg mt-0.5 text-[var(--ink)]">{routeObj.frequencyPeak}</div>
          </div>
          <div className="flex-1 bg-[var(--surf)] rounded-3xl p-3 px-4 border border-[var(--border2)]">
            <div className="text-[11px] uppercase tracking-wider text-[var(--neu6)]">{isEs ? "Horario Hábil" : "Weekday"}</div>
            <div className="font-heading text-lg mt-0.5 text-[var(--ink)]">{routeObj.hoursWeekday}</div>
          </div>
        </div>

        {/* Timeline Stops */}
        <div>
          <h3 className="font-heading text-lg mb-2">{isEs ? "Paradas de la ruta" : "Route stops"} ({routeObj.stops.length})</h3>
          <div className="flex flex-col">
            {routeObj.stops.map((s, idx) => {
              const isLast = idx === routeObj.stops.length - 1
              return (
                <div key={idx} className="flex gap-3.5 items-stretch">
                  <div className="w-5 flex-none flex flex-col items-center">
                    <div
                      className="w-3.5 h-3.5 rounded-full flex-none"
                      style={{ backgroundColor: routeObj.color || "var(--accent)" }}
                    />
                    {!isLast && <div className="w-0.5 flex-1 min-h-[28px] bg-[var(--border)]" />}
                  </div>
                  <div className="pb-3.5 flex-1 flex justify-between gap-2">
                    <div className="text-sm font-medium text-[var(--ink)]">{s.stationName}</div>
                    <div className="text-xs text-[var(--neu7)] flex-none">+{s.minutesFromStart} min</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Filter routes from real ROUTES_DATABASE
  const filteredRoutes = ROUTES_DATABASE.filter((r) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      r.code.toLowerCase().includes(q) ||
      q.includes(r.code.toLowerCase()) ||
      r.name.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q)

    if (q) return matchesSearch

    const matchesCategory =
      selectedType === "troncal"
        ? r.type === "troncal" || r.type === "dual"
        : selectedType === "zonal"
        ? r.type === "zonal"
        : r.type === "alimentadora"

    return matchesCategory
  })


  // Category Info Headers
  const categoryHeader = {
    troncal: {
      color: "#c67139",
      tint: "#ffe1d0",
      title: isEs ? "Rutas Troncales y Duales (Buses rojos)" : "Trunk & Dual Routes",
      desc: isEs
        ? "Buses articulados, biarticulados y duales que transitan por carriles exclusivos y estaciones fijas."
        : "Articulated and dual buses operating on exclusive lanes with dedicated stations.",
    },
    zonal: {
      color: "#2563eb",
      tint: "#dbeafe",
      title: isEs ? "Rutas Zonales SITP Oficiales (Buses Azules)" : "Official Zonal SITP Routes",
      desc: isEs
        ? "Buses urbanos del SITP que conectan los diferentes barrios de Bogotá con paraderos de calle (677 rutas oficiales)."
        : "Urban SITP buses connecting Bogotá neighborhoods with street bus stops (677 official routes).",
    },
    alimentadora: {
      color: "#10b981",
      tint: "#d1fae5",
      title: isEs ? "Rutas Alimentadoras (Verde)" : "Feeder Routes (Green)",
      desc: isEs
        ? "Rutas gratuitas que transportan usuarios entre barrios y los Portales de TransMilenio."
        : "Free buses transporting riders between residential areas and Portals.",
    },
  }[selectedType]

  return (
    <div className="p-4 flex flex-col gap-4 bg-[var(--bg)] text-[var(--ink)] min-h-full">
      <h2 className="font-heading text-3xl m-0">{isEs ? "Directorio de Rutas" : "Routes Directory"}</h2>

      {/* Search Input */}
      <div className="h-11 rounded-full bg-[var(--surf)] border border-[var(--border2)] flex items-center gap-3 px-4 shadow-xs">
        <Search className="w-4.5 h-4.5 text-[var(--accent-dark)] stroke-[2.75] flex-none" />
        <input
          type="text"
          placeholder={isEs ? "Buscar ruta (ej: K9, G503, A503, B911, H72, 12, 740)..." : "Search route code..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-0 outline-none text-xs font-medium text-[var(--ink)] placeholder:text-[var(--neu6)]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="border-0 bg-transparent text-[var(--neu6)] cursor-pointer text-xs font-semibold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 p-1 bg-[var(--surf)] rounded-full border border-[var(--border2)]">
        <button
          type="button"
          onClick={() => setSelectedType("troncal")}
          className={`flex-1 py-2 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
            selectedType === "troncal"
              ? "bg-[var(--accent)] text-[#f5ead8] shadow-xs"
              : "bg-transparent text-[var(--neu6)]"
          }`}
        >
          {isEs ? "Troncal (126)" : "Trunk"}
        </button>
        <button
          type="button"
          onClick={() => setSelectedType("zonal")}
          className={`flex-1 py-2 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
            selectedType === "zonal"
              ? "bg-[var(--accent)] text-[#f5ead8] shadow-xs"
              : "bg-transparent text-[var(--neu6)]"
          }`}
        >
          {isEs ? "Zonal SITP (677)" : "Zonal"}
        </button>
        <button
          type="button"
          onClick={() => setSelectedType("alimentadora")}
          className={`flex-1 py-2 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
            selectedType === "alimentadora"
              ? "bg-[var(--accent)] text-[#f5ead8] shadow-xs"
              : "bg-transparent text-[var(--neu6)]"
          }`}
        >
          {isEs ? "Alimentadora" : "Feeder"}
        </button>
      </div>

      {/* Info Box */}
      <div
        className="flex gap-3 items-start rounded-3xl p-3.5 border border-[var(--border2)]"
        style={{ backgroundColor: categoryHeader.tint }}
      >
        <div
          className="w-3 h-3 rounded-full flex-none mt-1"
          style={{ backgroundColor: categoryHeader.color }}
        />
        <div>
          <div className="font-heading text-base leading-tight text-[var(--ink)]">{categoryHeader.title}</div>
          <div className="text-xs text-[var(--neu7b)] leading-relaxed mt-0.5">{categoryHeader.desc}</div>
        </div>
      </div>

      {/* Dynamic Routes List */}
      <div className="flex flex-col gap-2.5">
        {filteredRoutes.length === 0 ? (
          <div className="p-6 text-center text-[var(--neu7)] text-sm bg-[var(--surf)] rounded-3xl">
            {isEs ? "No se encontraron rutas para tu búsqueda." : "No routes found for your search."}
          </div>
        ) : (
          filteredRoutes.slice(0, 100).map((r, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedRouteCode(r.code)}
              className="text-left w-full border-0 bg-[var(--surf)] rounded-3xl p-3 px-4 flex items-center gap-3 cursor-pointer hover:bg-[var(--surf2)] transition-colors border border-[var(--border2)]"
            >
              <span
                className="w-11 h-9 rounded-2xl flex items-center justify-center font-heading text-sm font-semibold flex-none shadow-xs text-white"
                style={{ backgroundColor: r.color || "var(--accent)" }}
              >
                {r.code}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[var(--ink)] truncate">{r.name}</div>
                <div className="text-xs text-[var(--neu7)] truncate">
                  {r.origin} ➔ {r.destination} • Pico: {r.frequencyPeak}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--neu6)] stroke-[2.75]" />
            </button>
          ))
        )}
      </div>

      {/* Schedules Link */}
      <Link href="/horarios" className="no-underline mt-2">
        <button
          type="button"
          className="w-full h-12 border border-[var(--border)] rounded-full bg-transparent font-heading text-sm text-[var(--ink)] flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--hover)] transition-colors"
        >
          <Clock className="w-4.5 h-4.5 stroke-[2.75]" />
          {isEs ? "Ver tabla de horarios completa" : "View full schedule table"}
        </button>
      </Link>
    </div>
  )
}

