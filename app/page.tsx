"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { RoutePlanner } from "@/components/RoutePlanner"
import { Onboarding } from "@/components/Onboarding"
import { TripProgress } from "@/components/TripProgress"
import { StationDetail } from "@/components/StationDetail"
import { useApp } from "@/lib/AppContext"
import { STATIONS_DATABASE, Station } from "@/lib/transmilenioData"
import { planTrip, TripPlanResult } from "@/lib/routePlanner"
import {
  Home,
  Briefcase,
  GraduationCap,
  Sprout,
  Bus,
  ArrowLeft,
  Repeat,
  Footprints,
  Users,
  ChevronRight,
} from "lucide-react"

export default function InicioPage() {
  const { language, beginnerMode, onboardingDone, setOnboardingDone } = useApp()
  const isEs = language === "es"

  // Screen View state: 'home' | 'onboarding' | 'results' | 'trip' | 'station'
  const [currentView, setCurrentView] = useState<
    "home" | "onboarding" | "results" | "trip" | "station"
  >(onboardingDone ? "home" : "onboarding")

  const [origin, setOrigin] = useState("Portal Suba")
  const [destination, setDestination] = useState("Calle 26")
  const [selectedStation, setSelectedStation] = useState<Station>(STATIONS_DATABASE[6]) // Calle 26
  const [searchResults, setSearchResults] = useState<TripPlanResult[]>([])
  const [selectedTripPlan, setSelectedTripPlan] = useState<TripPlanResult | null>(null)
  const [sortOption, setSortOption] = useState<"fast" | "easy">("fast")

  // Handle onboarding complete
  const handleStart = () => {
    setOnboardingDone(true)
    setCurrentView("home")
  }

  // Execute Route Planning
  const handleSearchRoutes = async () => {
    if (
      destination.toLowerCase().includes("draco") ||
      destination.toLowerCase().includes("unicentro") ||
      origin.toLowerCase().includes("gps") ||
      origin.toLowerCase().includes("ubicación")
    ) {
      window.location.href = `/mapa?dest=${encodeURIComponent(destination)}&orig=${encodeURIComponent(origin)}`
      return
    }

    const plans = planTrip(origin, destination)
    setSearchResults(plans)
    setCurrentView("results")
  }

  // Saved places chips
  const savedPlaces = [
    { icon: Home, label: isEs ? "Casa" : "Home", val: "Portal Suba" },
    { icon: Briefcase, label: isEs ? "Trabajo" : "Work", val: "Calle 26" },
    { icon: GraduationCap, label: isEs ? "Universidad" : "University", val: "Universidades / Las Aguas" },
  ]

  // Real Nearby Stations Data from Database
  const nearbyStations = STATIONS_DATABASE.slice(0, 4)

  // RENDER ONBOARDING VIEW
  if (currentView === "onboarding") {
    return <Onboarding onStart={handleStart} />
  }

  // RENDER TRIP IN PROGRESS VIEW
  if (currentView === "trip") {
    return <TripProgress onBack={() => setCurrentView("home")} />
  }

  // RENDER STATION DETAIL VIEW
  if (currentView === "station") {
    return (
      <StationDetail
        stationName={selectedStation.name}
        stationMeta={selectedStation.address}
        onBack={() => setCurrentView("home")}
      />
    )
  }

  // RENDER SEARCH RESULTS VIEW
  if (currentView === "results") {
    const displayedResults =
      sortOption === "fast"
        ? [...searchResults].sort((a, b) => a.totalMinutes - b.totalMinutes)
        : [...searchResults].sort((a, b) => a.transfersCount - b.transfersCount)

    return (
      <div className="p-4 flex flex-col gap-4 bg-[var(--bg)] text-[var(--ink)] min-h-full">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView("home")}
            className="w-10 h-10 flex-none border-0 rounded-full bg-[var(--surf)] text-[var(--neu7b)] flex items-center justify-center cursor-pointer hover:bg-[var(--surf2)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.75]" />
          </button>
          <div className="min-w-0">
            <div className="font-heading text-xl truncate leading-tight">
              {origin} → {destination}
            </div>
            <div className="text-xs text-[var(--neu7)]">
              {searchResults.length} {isEs ? "opciones reales encontradas" : "real route options found"}
            </div>
          </div>
        </div>

        {/* Sort Pills */}
        <div className="flex gap-2 p-1 bg-[var(--surf)] rounded-full border border-[var(--border2)]">
          <button
            type="button"
            onClick={() => setSortOption("fast")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
              sortOption === "fast"
                ? "bg-[var(--accent)] text-[#f5ead8] shadow-xs"
                : "bg-transparent text-[var(--neu6)]"
            }`}
          >
            {isEs ? "Más rápido" : "Fastest"}
          </button>
          <button
            type="button"
            onClick={() => setSortOption("easy")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
              sortOption === "easy"
                ? "bg-[var(--accent)] text-[#f5ead8] shadow-xs"
                : "bg-transparent text-[var(--neu6)]"
            }`}
          >
            {isEs ? "Menos transbordos" : "Fewest transfers"}
          </button>
        </div>

        {/* Option Cards */}
        <div className="flex flex-col gap-3">
          {displayedResults.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setSelectedTripPlan(opt)
                setCurrentView("trip")
              }}
              className="text-left w-full border-0 bg-[var(--surf)] rounded-3xl p-4 flex flex-col gap-3 cursor-pointer hover:bg-[var(--surf2)] transition-colors border border-[var(--border2)] shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {opt.legs.map((l, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full font-heading text-sm font-semibold text-[#f5ead8]"
                      style={{ backgroundColor: l.color }}
                    >
                      {l.routeCode}
                    </span>
                  ))}
                </div>
                <div className="text-right flex-none">
                  <div className="font-heading text-2xl leading-none text-[var(--ink)]">{opt.totalMinutes}</div>
                  <div className="text-[10px] text-[var(--neu6)] font-semibold uppercase tracking-wider">MIN</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--neu7)] flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Repeat className="w-3.5 h-3.5 stroke-[2.75]" />
                  {opt.transfersCount === 0
                    ? isEs ? "Directo" : "Direct"
                    : isEs ? `1 transbordo en ${opt.transferStationName}` : `1 transfer at ${opt.transferStationName}`}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 stroke-[2.75]" />
                  {opt.walkMinutes} min
                </span>
                <span className="inline-flex items-center gap-1 font-medium" style={{ color: opt.crowdColor }}>
                  <Users className="w-3.5 h-3.5 stroke-[2.75]" />
                  {opt.crowdLevel}
                </span>
                <span className="ml-auto font-heading text-sm text-[var(--ink)]">{opt.fare}</span>
              </div>

              {beginnerMode && (
                <div className="text-xs leading-relaxed text-[var(--sage-text)] bg-[var(--sage-bg)] rounded-2xl p-2.5 px-3">
                  💡 {opt.beginnerTip}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // DEFAULT: HOME VIEW
  return (
    <div className="p-4 flex flex-col gap-4 bg-[var(--bg)] text-[var(--ink)] min-h-full">
      {/* Header */}
      <Header />

      {/* Route Planner Card */}
      <RoutePlanner
        origin={origin}
        destination={destination}
        setOrigin={setOrigin}
        setDestination={setDestination}
        onSearch={handleSearchRoutes}
      />

      {/* Saved Places Chips */}
      <div className="flex gap-2 flex-wrap">
        {savedPlaces.map((p, idx) => {
          const IconComp = p.icon
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setDestination(p.val)
              }}
              className="inline-flex items-center gap-2 border border-[var(--border)] rounded-full bg-transparent px-3.5 py-2 text-xs font-semibold text-[var(--ink)] cursor-pointer hover:bg-[var(--hover)] transition-colors active:scale-95"
            >
              <IconComp className="w-4 h-4 stroke-[2.75] text-[var(--accent-dark)]" />
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Beginner Mode Tip Box */}
      {beginnerMode && (
        <div className="flex gap-3 items-start bg-[var(--sage-bg)] rounded-3xl p-3.5 px-4 border border-[var(--border2)]">
          <Sprout className="w-5 h-5 text-[var(--sage-ink)] flex-none mt-0.5 stroke-[2.75]" />
          <div className="text-xs leading-relaxed text-[var(--sage-text)] font-medium">
            {isEs
              ? "💡 Modo Principiante: Los buses expresos (ej: K9, B14, F23) solo paran en estaciones clave. Revisa las paradas antes de abordar."
              : "💡 Beginner Mode: Express buses (e.g. K9, B14, F23) only stop at main stations. Check stops before boarding."}
          </div>
        </div>
      )}

      {/* Nearby Stations List from Database */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-heading text-xl m-0">{isEs ? "Estaciones principales" : "Main stations"}</h3>
          <a
            href="/mapa"
            className="text-xs font-semibold text-[var(--accent-dark)] hover:underline no-underline"
          >
            {isEs ? "Ver en mapa" : "View on map"} →
          </a>
        </div>

        <div className="flex flex-col gap-2.5">
          {nearbyStations.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSelectedStation(s)
                setCurrentView("station")
              }}
              className="text-left w-full border-0 bg-[var(--surf)] rounded-3xl p-3 px-4 flex items-center gap-3 cursor-pointer hover:bg-[var(--surf2)] transition-colors border border-[var(--border2)] shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--bg)] text-[var(--accent-dark)] flex items-center justify-center flex-none">
                <Bus className="w-5 h-5 stroke-[2.75]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading text-base leading-tight truncate">{s.name}</div>
                <div className="text-xs text-[var(--neu7)] truncate">{s.address}</div>
              </div>
              <div className="text-right flex-none">
                <div className="font-heading text-lg text-[var(--accent-dark)] leading-none">
                  {s.routes.slice(0, 2).join(", ")}
                </div>
                <div className="text-[10px] text-[var(--neu6)] font-semibold uppercase">rutas</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--neu6)] stroke-[2.75]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
