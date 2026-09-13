"use client"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { Search, Bus, ChevronRight, X, ChevronUp, ChevronDown, Navigation, Star, Wifi, MapPin, ArrowRightLeft, Clock, DollarSign, Footprints, Target, Crosshair } from "lucide-react"
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MapControls,
  MapRoute,
  type MapRef,
} from "@/components/ui/map"
import { StationDetail } from "@/components/StationDetail"
import { useApp } from "@/lib/AppContext"
import { STATIONS_DATABASE } from "@/lib/transmilenioData"
import { fetchRealTransmilenioStations, fetchRealTransmilenioTroncalesPolylines, type RealPolylineLine } from "@/lib/transmilenioLiveApi"
import { planTrip, type TripPlanResult } from "@/lib/routePlanner"
import { searchPlacesInBogota, calculateDoorToDoorTrip, calculateDoorToDoorTripAsync, type PlaceItem, type DoorToDoorTripResult, POPULAR_BOGOTA_PLACES } from "@/lib/placesAndRouting"

export interface StationData {
  id: string
  name: string
  meta: string
  dist: string
  lat: number
  lng: number
  line: string
  routes: string[]
}

const FALLBACK_STATIONS: StationData[] = STATIONS_DATABASE.map((s) => ({
  id: s.id,
  name: s.name,
  meta: `${s.address} • Zona ${s.zone}`,
  dist: "Estación Troncal",
  lat: s.lat,
  lng: s.lng,
  line: `Zona ${s.zone}`,
  routes: s.routes,
}))

export default function MapaPage() {
  const { theme } = useTheme()
  const { language } = useApp()
  const isEs = language === "es"

  const mapRef = useRef<MapRef | null>(null)

  const [stations, setStations] = useState<StationData[]>(FALLBACK_STATIONS)
  const [polylines, setPolylines] = useState<RealPolylineLine[]>([])
  const [isLiveApi, setIsLiveApi] = useState(false)
  
  // Navigation Mode
  const [plannerMode, setPlannerMode] = useState<"search" | "station-route" | "door-to-door">("door-to-door")
  
  // Station to Station State
  const [originStation, setOriginStation] = useState<StationData | null>(null)
  const [destStation, setDestStation] = useState<StationData | null>(null)
  const [originInput, setOriginInput] = useState("")
  const [destInput, setDestInput] = useState("")
  const [tripResults, setTripResults] = useState<TripPlanResult[] | null>(null)

  // Door to Door Places State
  const [originPlace, setOriginPlace] = useState<PlaceItem | null>(null)
  const [destPlace, setDestPlace] = useState<PlaceItem | null>(null)
  const [placeOriginQuery, setPlaceOriginQuery] = useState("")
  const [placeDestQuery, setPlaceDestQuery] = useState("")
  const [originSuggestions, setOriginSuggestions] = useState<PlaceItem[]>([])
  const [destSuggestions, setDestSuggestions] = useState<PlaceItem[]>([])
  const [doorToDoorResult, setDoorToDoorResult] = useState<DoorToDoorTripResult | null>(null)
  const [isLocatingUser, setIsLocatingUser] = useState(false)
  const [isCalculatingTrip, setIsCalculatingTrip] = useState(false)

  // 100ms Debounce States
  const [debouncedOriginQuery, setDebouncedOriginQuery] = useState("")
  const [debouncedDestQuery, setDebouncedDestQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  const [calculatedPathCoords, setCalculatedPathCoords] = useState<[number, number][]>([])
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null)
  const [activeDetailStation, setActiveDetailStation] = useState<{ id: string; name: string; meta: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSheetExpanded, setIsSheetExpanded] = useState(false)

  // Handle URL Params if passed from home page (e.g. ?dest=Draco%20Hobby%20Center)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const orig = params.get("orig")
      const dest = params.get("dest")
      if (orig) setPlaceOriginQuery(orig)
      if (dest) setPlaceDestQuery(dest)
    }
  }, [])

  // Load official TransMilenio 153 Stations & 22 Colored Polylines
  useEffect(() => {
    async function loadData() {
      try {
        const [liveStations, livePolylines] = await Promise.all([
          fetchRealTransmilenioStations(),
          fetchRealTransmilenioTroncalesPolylines(),
        ])

        if (Array.isArray(liveStations) && liveStations.length > 0) {
          const mapped: StationData[] = liveStations.map((st) => ({
            id: st.id,
            name: st.name,
            meta: `${st.address} • Zona ${st.zone}`,
            dist: st.isPortal ? "Portal / Hub" : `${st.wagons} Vagón(es)`,
            lat: st.lat,
            lng: st.lng,
            line: `Zona ${st.zone}`,
            routes: st.routes || ["K9", "B14"],
          }))
          setStations(mapped)
          setIsLiveApi(true)
        }

        if (Array.isArray(livePolylines) && livePolylines.length > 0) {
          setPolylines(livePolylines)
        }
      } catch (e) {
        console.warn("Using fallback local dataset", e)
      }
    }
    loadData()
  }, [])

  // Auto-focus camera on originPlace / destPlace selection
  useEffect(() => {
    if (!mapRef.current) return
    if (originPlace && destPlace) {
      const minLng = Math.min(originPlace.lng, destPlace.lng)
      const maxLng = Math.max(originPlace.lng, destPlace.lng)
      const minLat = Math.min(originPlace.lat, destPlace.lat)
      const maxLat = Math.max(originPlace.lat, destPlace.lat)

      mapRef.current.flyTo({
        center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
        zoom: 13.5,
        duration: 1200,
      })
    } else if (destPlace) {
      mapRef.current.flyTo({
        center: [destPlace.lng, destPlace.lat],
        zoom: 15.5,
        duration: 1200,
      })
    } else if (originPlace) {
      mapRef.current.flyTo({
        center: [originPlace.lng, originPlace.lat],
        zoom: 15.5,
        duration: 1200,
      })
    }
  }, [originPlace, destPlace])

  // 100ms Debounce timers to prevent excessive queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedOriginQuery(placeOriginQuery)
    }, 100)
    return () => clearTimeout(timer)
  }, [placeOriginQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDestQuery(placeDestQuery)
    }, 100)
    return () => clearTimeout(timer)
  }, [placeDestQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 100)
    return () => clearTimeout(timer)
  }, [searchQuery])




  useEffect(() => {
    const query = debouncedOriginQuery.trim()
    if (!query) {
      setOriginSuggestions([])
      return
    }
    let isMounted = true
    searchPlacesInBogota(query).then((results) => {
      if (isMounted) {
        setOriginSuggestions(results)
      }
    })
    return () => { isMounted = false }
  }, [debouncedOriginQuery])

  // Place dest query autocomplete (keeps suggestions open while typing)
  useEffect(() => {
    const query = debouncedDestQuery.trim()
    if (!query) {
      setDestSuggestions([])
      return
    }
    let isMounted = true
    searchPlacesInBogota(query).then((results) => {
      if (isMounted) {
        setDestSuggestions(results)
      }
    })
    return () => { isMounted = false }
  }, [debouncedDestQuery])




  // Get current GPS Location ("Mi Ubicación Actual")
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada en tu dispositivo.")
      return
    }

    setIsLocatingUser(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude
        const userLng = pos.coords.longitude

        const gpsPlace: PlaceItem = {
          id: `gps-user-${Date.now()}`,
          name: "📍 Mi ubicación actual",
          address: "Posición GPS actual en Bogotá",
          lat: userLat,
          lng: userLng,
          category: "Tu ubicación GPS",
        }

        setOriginPlace(gpsPlace)
        setPlaceOriginQuery("📍 Mi ubicación actual")
        setOriginSuggestions([])
        setIsLocatingUser(false)

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [userLng, userLat],
            zoom: 15.5,
            duration: 1200,
          })
        }
      },
      (err) => {
        setIsLocatingUser(false)
        alert("No pudimos obtener tu posición GPS. Por favor selecciona una ubicación manualmente.")
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Calculate Door-to-Door Journey with 100% REAL street foot geometry (sidewalks/corners) & transit avenue geometry
  const handleCalculateDoorToDoor = async () => {
    setIsCalculatingTrip(true)
    let oP = originPlace
    let dP = destPlace

    if (!oP && placeOriginQuery.trim()) {
      const found = await searchPlacesInBogota(placeOriginQuery)
      if (found.length > 0) oP = found[0]
    }

    if (!dP && placeDestQuery.trim()) {
      const found = await searchPlacesInBogota(placeDestQuery)
      if (found.length > 0) dP = found[0]
    }

    if (!oP) oP = POPULAR_BOGOTA_PLACES[3] // Fallback UNAL
    if (!dP) dP = POPULAR_BOGOTA_PLACES[0] // Fallback Draco Hobby

    setOriginPlace(oP)
    setDestPlace(dP)
    setPlaceOriginQuery(oP.name)
    setPlaceDestQuery(dP.name)

    const result = await calculateDoorToDoorTripAsync(oP, dP, stations)
    setDoorToDoorResult(result)
    setIsSheetExpanded(true)
    setIsCalculatingTrip(false)

    // Fit map camera to bound all 4 key points cleanly
    if (mapRef.current) {
      const minLng = Math.min(oP.lng, dP.lng, result.nearestOriginStation.lng, result.nearestDestStation.lng)
      const maxLng = Math.max(oP.lng, dP.lng, result.nearestOriginStation.lng, result.nearestDestStation.lng)
      const minLat = Math.min(oP.lat, dP.lat, result.nearestOriginStation.lat, result.nearestDestStation.lat)
      const maxLat = Math.max(oP.lat, dP.lat, result.nearestOriginStation.lat, result.nearestDestStation.lat)

      mapRef.current.flyTo({
        center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
        zoom: 13,
        duration: 1500,
      })
    }
  }

  // Calculate Station A -> Station B
  const handleCalculateStationTrip = () => {
    const oName = originStation ? originStation.name : originInput
    const dName = destStation ? destStation.name : destInput

    if (!oName || !dName) return

    const results = planTrip(oName, dName)
    setTripResults(results)
    setIsSheetExpanded(true)

    const oSt = stations.find((s) => s.name.toLowerCase().includes(oName.toLowerCase())) || stations[0]
    const dSt = stations.find((s) => s.name.toLowerCase().includes(dName.toLowerCase())) || stations[stations.length - 1]

    if (oSt && dSt) {
      setCalculatedPathCoords([
        [oSt.lng, oSt.lat],
        [(oSt.lng + dSt.lng) / 2, (oSt.lat + dSt.lat) / 2 + 0.005],
        [dSt.lng, dSt.lat],
      ])

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [(oSt.lng + dSt.lng) / 2, (oSt.lat + dSt.lat) / 2],
          zoom: 12.5,
          duration: 1500,
        })
      }
    }
  }

  const handleSelectStation = (station: StationData) => {
    setSelectedStation(station)
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [station.lng, station.lat],
        zoom: 15.5,
        duration: 1200,
      })
    }
  }

  const filteredStations = stations.filter((s) => {
    if (!debouncedSearchQuery.trim()) return true
    const q = debouncedSearchQuery.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      s.meta.toLowerCase().includes(q)
    )
  })


  if (activeDetailStation) {
    return (
      <StationDetail
        stationId={activeDetailStation.id}
        stationName={activeDetailStation.name}
        stationMeta={activeDetailStation.meta}
        onBack={() => setActiveDetailStation(null)}
      />
    )
  }

  const mapTheme = theme === "dark" ? "dark" : "light"

  return (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-16 bg-[var(--bg)] text-[var(--ink)] overflow-hidden z-0">
      {/* Fullscreen Map Canvas */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Map
          ref={mapRef}
          center={[-74.0721, 4.6534]}
          zoom={12}
          theme={mapTheme}
          className="w-full h-full"
        >
          <MapControls
            position="top-right"
            showZoom
            showLocate
            showCompass
            onLocate={(coords) => {
              mapRef.current?.flyTo({
                center: [coords.longitude, coords.latitude],
                zoom: 15,
                duration: 1500,
              })
            }}
            className="top-40 right-3"
          />

          {/* Official TransMilenio 22 GIS Polylines (ONLY SHOWN WHEN NO TRIP IS ACTIVE) */}
          {!doorToDoorResult && polylines.map((line) => (
            <MapRoute
              key={line.id}
              id={`gis-line-${line.id}`}
              coordinates={line.coordinates}
              color={line.color}
              width={5}
              opacity={0.75}
            />
          ))}

          {/* ACTIVE DOOR-TO-DOOR ROUTE LEGS (REAL STREET FOOT + REAL BUS TRANSIT) */}
          {doorToDoorResult && (
            <>
              {/* Leg 1: Walk to Boarding Station (Dashed Green following real sidewalks) */}
              <MapRoute
                id="walk-leg-1"
                coordinates={doorToDoorResult.walkLeg1Coords}
                color="#16a34a"
                width={6}
                opacity={0.95}
                dashArray={[2, 2]}
              />

              {/* Leg 2: TransMilenio Transit Route (Solid Bus Line following real avenues with valid hex color) */}
              <MapRoute
                id="bus-leg-transit"
                coordinates={doorToDoorResult.busLegCoords}
                color="#e11d48"
                width={9}
                opacity={0.98}
              />

              {/* Leg 3: Walk to Destination Place (Dashed Purple following real sidewalks) */}
              <MapRoute
                id="walk-leg-2"
                coordinates={doorToDoorResult.walkLeg2Coords}
                color="#9333ea"
                width={6}
                opacity={0.95}
                dashArray={[2, 2]}
              />
            </>
          )}

          {/* ALWAYS RENDER SELECTED ORIGIN & DESTINATION PINS WHEN SEARCHING OR NAVIGATING */}
          {originPlace && (
            <MapMarker longitude={originPlace.lng} latitude={originPlace.lat}>
              <MarkerContent>
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-emerald-300">
                  <MapPin className="w-5 h-5 stroke-[2.75]" />
                </div>
              </MarkerContent>
              <MarkerTooltip>🚩 Origen: {originPlace.name}</MarkerTooltip>
            </MapMarker>
          )}

          {destPlace && (
            <MapMarker longitude={destPlace.lng} latitude={destPlace.lat}>
              <MarkerContent>
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-purple-300">
                  <Target className="w-5 h-5 stroke-[2.75]" />
                </div>
              </MarkerContent>
              <MarkerTooltip>🏁 Destino: {destPlace.name}</MarkerTooltip>
            </MapMarker>
          )}

          {/* BOARDING & ALIGHTING STATIONS SHOWN WHEN TRIP IS ACTIVE */}
          {doorToDoorResult && (
            <>
              {/* Boarding Station Marker (Blue/Gold) */}
              <MapMarker
                longitude={doorToDoorResult.nearestOriginStation.lng}
                latitude={doorToDoorResult.nearestOriginStation.lat}
              >
                <MarkerContent>
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-blue-300">
                    <Bus className="w-5 h-5 stroke-[2.75]" />
                  </div>
                </MarkerContent>
                <MarkerTooltip>🚏 Estación Abordaje: {doorToDoorResult.nearestOriginStation.name}</MarkerTooltip>
              </MapMarker>

              {/* Alighting Station Marker (Blue/Gold) */}
              <MapMarker
                longitude={doorToDoorResult.nearestDestStation.lng}
                latitude={doorToDoorResult.nearestDestStation.lat}
              >
                <MarkerContent>
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-indigo-300">
                    <Bus className="w-5 h-5 stroke-[2.75]" />
                  </div>
                </MarkerContent>
                <MarkerTooltip>🚏 Estación Descenso: {doorToDoorResult.nearestDestStation.name}</MarkerTooltip>
              </MapMarker>
            </>
          )}

          {/* ALL GENERAL STATIONS SHOWN ONLY WHEN NO TRIP IS ACTIVE */}
          {!doorToDoorResult &&
            filteredStations.map((station) => {
              const isSelected = selectedStation?.id === station.id

              return (
                <MapMarker
                  key={station.id}
                  longitude={station.lng}
                  latitude={station.lat}
                  onClick={() => handleSelectStation(station)}
                >
                  <MarkerContent>
                    <div
                      className={`relative flex items-center justify-center transition-transform cursor-pointer ${
                        isSelected ? "scale-125 z-30" : "hover:scale-110 z-10"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white ${
                          isSelected
                            ? "bg-[var(--accent)] text-white ring-4 ring-[var(--accent-light)]"
                            : "bg-[var(--accent-dark)] text-[#f5ead8]"
                        }`}
                      >
                        <Bus className="w-3.5 h-3.5 stroke-[2.75]" />
                      </div>
                    </div>
                  </MarkerContent>
                  <MarkerTooltip>{station.name}</MarkerTooltip>
                  {isSelected && (
                    <MarkerPopup closeButton onClose={() => setSelectedStation(null)}>
                      <div className="p-1 max-w-[220px] flex flex-col gap-1.5 text-left">
                        <div className="font-heading text-base leading-tight text-[var(--ink)]">{station.name}</div>
                        <div className="text-[11.5px] text-[var(--neu7)]">{station.meta}</div>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {station.routes.map((r, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-[var(--accent)] text-[#f5ead8] text-[10px] font-heading">
                              {r}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveDetailStation({ id: station.id, name: station.name, meta: station.meta })}
                          className="mt-1 text-xs font-heading text-[var(--accent-dark)] border-0 bg-[var(--accent-light)] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[var(--accent-tint-hover)] transition-colors w-full text-center shadow-xs"
                        >
                          {isEs ? "Ver detalle de estación" : "View station details"} →
                        </button>
                      </div>
                    </MarkerPopup>
                  )}
                </MapMarker>
              )
            })}
        </Map>
      </div>

      {/* Top Floating Panel: Door to Door Trip Planner */}
      <div className="absolute top-4 left-3 right-3 z-20 flex flex-col gap-2">
        {/* Door to Door Places Navigation (e.g. Mi Ubicación -> Unlimited Comics / Draco Hobby Center) */}
        {plannerMode === "door-to-door" && (
          <div className="bg-[var(--bg)]/95 backdrop-blur-md border border-[var(--border)] rounded-3xl p-3 shadow-xl flex flex-col gap-2 relative">
            {/* Origin Place Input */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-[var(--surf)] border border-[var(--border2)] rounded-2xl px-3 py-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-none" />
                <input
                  type="text"
                  placeholder={isEs ? "Origen (ej: Mi ubicación actual / UNAL)" : "Origin..."}
                  value={placeOriginQuery}
                  onChange={(e) => {
                    setPlaceOriginQuery(e.target.value)
                    setOriginPlace(null)
                  }}
                  className="w-full bg-transparent border-0 outline-none text-xs text-[var(--ink)] placeholder:text-[var(--neu6)]"
                />
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocatingUser}
                  className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-lg border-0 cursor-pointer flex items-center gap-1 flex-none"
                >
                  <Crosshair className="w-3 h-3 text-emerald-600" />
                  {isLocatingUser ? "GPS..." : "📍 Mi GPS"}
                </button>
              </div>

              {/* Suggestions dropdown (STAYS OPEN WHILE TYPING, closes on select) */}
              {originSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-lg z-50 overflow-hidden flex flex-col max-h-48 overflow-y-auto">
                  {originSuggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setOriginPlace(p)
                        setPlaceOriginQuery(p.name)
                        setOriginSuggestions([])
                        if (mapRef.current) {
                          mapRef.current.flyTo({
                            center: [p.lng, p.lat],
                            zoom: 16,
                            duration: 1200,
                          })
                        }
                      }}
                      className="text-left p-2 px-3 border-0 bg-transparent hover:bg-[var(--surf2)] cursor-pointer border-b border-[var(--border2)] last:border-0 flex flex-col"
                    >
                      <div className="font-heading text-xs text-[var(--ink)] flex items-center gap-1">
                        <span>{p.name}</span>
                        {p.category && <span className="text-[10px] text-[var(--accent-dark)] font-normal">({p.category})</span>}
                      </div>
                      <div className="text-[10px] text-[var(--neu7)] truncate">{p.address}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Place Input */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-[var(--surf)] border border-[var(--border2)] rounded-2xl px-3 py-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 flex-none" />
                <input
                  type="text"
                  placeholder={isEs ? "Destino (ej: Draco Hobby Center / Unlimited)" : "Destination..."}
                  value={placeDestQuery}
                  onChange={(e) => {
                    setPlaceDestQuery(e.target.value)
                    setDestPlace(null)
                  }}
                  className="w-full bg-transparent border-0 outline-none text-xs text-[var(--ink)] placeholder:text-[var(--neu6)]"
                />
              </div>

              {/* Suggestions dropdown (STAYS OPEN WHILE TYPING, closes on select) */}
              {destSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-lg z-50 overflow-hidden flex flex-col max-h-48 overflow-y-auto">
                  {destSuggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setDestPlace(p)
                        setPlaceDestQuery(p.name)
                        setDestSuggestions([])
                        if (mapRef.current) {
                          mapRef.current.flyTo({
                            center: [p.lng, p.lat],
                            zoom: 16,
                            duration: 1200,
                          })
                        }
                      }}
                      className="text-left p-2 px-3 border-0 bg-transparent hover:bg-[var(--surf2)] cursor-pointer border-b border-[var(--border2)] last:border-0 flex flex-col"
                    >
                      <div className="font-heading text-xs text-[var(--ink)] flex items-center gap-1">
                        <span>{p.name}</span>
                        {p.category && <span className="text-[10px] text-[var(--accent-dark)] font-normal">({p.category})</span>}
                      </div>
                      <div className="text-[10px] text-[var(--neu7)] truncate">{p.address}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Calculate Action Button */}
            <button
              type="button"
              onClick={handleCalculateDoorToDoor}
              disabled={isCalculatingTrip}
              className="w-full bg-[var(--accent)] text-[#f5ead8] font-heading text-xs py-2 px-4 rounded-full border-0 cursor-pointer hover:bg-[var(--accent-tint-hover)] transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isCalculatingTrip ? "⌛ " + (isEs ? "Calculando calles y tránsito real..." : "Routing streets...") : "🚀 " + (isEs ? "Navegar Puerta a Puerta con TransMilenio" : "Navigate Door-to-Door")}
            </button>
          </div>
        )}

        {/* MODE 2: Station to Station Planner */}
        {plannerMode === "station-route" && (
          <div className="bg-[var(--bg)]/95 backdrop-blur-md border border-[var(--border)] rounded-3xl p-3 shadow-xl flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 flex-none" />
              <input
                type="text"
                placeholder={isEs ? "Estación Origen (ej: Portal Suba)" : "Origin station..."}
                value={originInput}
                onChange={(e) => setOriginInput(e.target.value)}
                className="w-full bg-[var(--surf)] border border-[var(--border2)] rounded-xl px-3 py-1.5 text-xs text-[var(--ink)] outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 flex-none" />
              <input
                type="text"
                placeholder={isEs ? "Estación Destino (ej: Calle 26)" : "Destination station..."}
                value={destInput}
                onChange={(e) => setDestInput(e.target.value)}
                className="w-full bg-[var(--surf)] border border-[var(--border2)] rounded-xl px-3 py-1.5 text-xs text-[var(--ink)] outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleCalculateStationTrip}
              className="w-full bg-[var(--accent)] text-[#f5ead8] font-heading text-xs py-2 px-4 rounded-full border-0 cursor-pointer hover:bg-[var(--accent-tint-hover)] transition-colors shadow-xs"
            >
              🚀 {isEs ? "Buscar Ruta entre Estaciones" : "Find Station Route"}
            </button>
          </div>
        )}

        {/* MODE 3: Simple Search */}
        {plannerMode === "search" && (
          <div className="h-12 rounded-full bg-[var(--bg)]/90 backdrop-blur-md border border-[var(--border)] shadow-lg flex items-center gap-3 px-4 transition-all">
            <Search className="w-5 h-5 text-[var(--accent-dark)] stroke-[2.75] flex-none" />
            <input
              type="text"
              placeholder={isEs ? "Buscar 153 estaciones de TransMilenio..." : "Search 153 TransMilenio stations..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (!isSheetExpanded) setIsSheetExpanded(true)
              }}
              className="w-full bg-transparent border-0 outline-none text-sm font-medium text-[var(--ink)] placeholder:text-[var(--neu6)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="border-0 bg-transparent text-[var(--neu6)] cursor-pointer p-1"
              >
                <X className="w-4 h-4 stroke-[2.75]" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Google Maps Bottom Sheet Drawer */}
      <div
        className={`fixed left-0 right-0 max-w-md mx-auto z-20 bg-[var(--bg)] border-t border-[var(--border)] rounded-t-[32px] shadow-2xl transition-all duration-300 flex flex-col ${
          isSheetExpanded ? "bottom-16 top-56" : "bottom-16 max-h-[170px]"
        }`}
      >
        {/* Handle Bar */}
        <button
          type="button"
          onClick={() => setIsSheetExpanded(!isSheetExpanded)}
          className="w-full py-2.5 flex flex-col items-center justify-center border-0 bg-transparent cursor-pointer"
        >
          <div className="w-12 h-1.5 rounded-full bg-[var(--surf2)] mb-1" />
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--neu6)] uppercase tracking-wider">
            {isSheetExpanded ? (
              <>
                <span>{isEs ? "Contraer" : "Collapse"}</span>
                <ChevronDown className="w-3.5 h-3.5 stroke-[2.75]" />
              </>
            ) : (
              <>
                <span>{isEs ? "Deslizar para ver detalles" : "Swipe for details"}</span>
                <ChevronUp className="w-3.5 h-3.5 stroke-[2.75]" />
              </>
            )}
          </div>
        </button>

        {/* Sheet Content */}
        <div className="px-4 pb-4 overflow-y-auto flex-1 flex flex-col gap-2.5 no-scrollbar">
          {/* Door to Door Result */}
          {doorToDoorResult ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-heading text-lg text-[var(--ink)]">
                  {isEs ? "Navegación Puerta a Puerta" : "Door-to-Door Navigation"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDoorToDoorResult(null)
                    setCalculatedPathCoords([])
                  }}
                  className="text-xs text-[var(--accent-dark)] font-semibold border-0 bg-transparent cursor-pointer"
                >
                  {isEs ? "Limpiar" : "Clear"}
                </button>
              </div>

              {/* Detailed Report Card */}
              <div className="bg-[var(--surf)] border border-[var(--border2)] rounded-3xl p-4 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-[var(--border2)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-heading text-sm text-[var(--ink)]">
                      {isEs ? "Reporte de Trayecto Oficial" : "Official Trip Report Card"}
                    </span>
                  </div>
                  <span className="font-heading text-xs text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {doorToDoorResult.fare}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[var(--bg)] p-2.5 rounded-2xl border border-[var(--border2)] flex flex-col gap-0.5">
                    <span className="text-[10px] text-[var(--neu6)] font-semibold uppercase">{isEs ? "Tiempo Estimado" : "Est. Time"}</span>
                    <span className="font-heading text-base text-[var(--accent-dark)] flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {doorToDoorResult.totalJourneyMinutes} min
                    </span>
                  </div>
                  <div className="bg-[var(--bg)] p-2.5 rounded-2xl border border-[var(--border2)] flex flex-col gap-0.5">
                    <span className="text-[10px] text-[var(--neu6)] font-semibold uppercase">{isEs ? "Distancia Total" : "Total Distance"}</span>
                    <span className="font-heading text-base text-[var(--ink)] flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-purple-600" /> ~{Math.round(doorToDoorResult.totalJourneyMinutes * 180)}m
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[var(--neu7)] bg-[var(--surf2)] p-2.5 rounded-2xl border border-[var(--border2)]">
                  <span className="font-semibold text-[var(--ink)]">{isEs ? "Ruta:" : "Route:"}</span> {doorToDoorResult.originPlace.name} ➔ {doorToDoorResult.destPlace.name}
                </div>

                {/* Multimodal Steps Timeline */}
                <div className="flex flex-col gap-2 mt-1">
                  <div className="text-[11px] font-heading text-[var(--neu6)] uppercase tracking-wider">{isEs ? "Pasos Detallados" : "Detailed Steps"}</div>
                  {doorToDoorResult.legs.map((leg, lIdx) => (
                    <div key={lIdx} className="flex items-center gap-3 bg-[var(--bg)] p-3 rounded-2xl border border-[var(--border2)]">
                      {leg.type === "walk" ? (
                        <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center flex-none font-bold">
                          <Footprints className="w-4 h-4 stroke-[2.75]" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full text-white flex items-center justify-center font-heading text-xs font-bold flex-none shadow-xs" style={{ backgroundColor: leg.busColor || "#e11d48" }}>
                          {leg.busCode}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-[var(--ink)] truncate">
                          {leg.type === "walk" ? `Caminar a ${leg.toName}` : `TransMilenio ${leg.busCode} (${leg.fromName} ➔ ${leg.toName})`}
                        </div>
                        <div className="text-[11px] text-[var(--neu7)] truncate">
                          {leg.type === "walk" ? `${leg.durationMinutes} min (${leg.distanceMeters}m a pie)` : `${leg.durationMinutes} min en bus • ${leg.stopsCount} paradas`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : tripResults && tripResults.length > 0 ? (
            /* Station to Station Results */
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-heading text-lg text-[var(--ink)]">
                  {isEs ? "Rutas calculadas" : "Calculated Trips"}
                </span>
                <button
                  type="button"
                  onClick={() => setTripResults(null)}
                  className="text-xs text-[var(--accent-dark)] font-semibold border-0 bg-transparent cursor-pointer"
                >
                  {isEs ? "Limpiar" : "Clear"}
                </button>
              </div>

              {tripResults.map((trip, idx) => (
                <div key={idx} className="bg-[var(--surf)] border border-[var(--border2)] rounded-3xl p-3.5 flex flex-col gap-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent-dark)] font-heading text-xs">
                      {trip.type === "direct" ? (isEs ? "Ruta Directa" : "Direct Route") : (isEs ? "1 Transbordo" : "1 Transfer")}
                    </span>
                    <div className="flex items-center gap-3 text-xs font-semibold text-[var(--ink)]">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[var(--accent-dark)]" /> {trip.totalMinutes} min</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {trip.fare}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-1">
                    {trip.legs.map((leg, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-2 bg-[var(--bg)] p-2.5 rounded-2xl border border-[var(--border2)]">
                        <span className="w-10 h-8 rounded-xl flex items-center justify-center font-heading text-xs font-semibold text-white flex-none" style={{ backgroundColor: leg.color || "var(--accent)" }}>
                          {leg.routeCode}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs text-[var(--ink)] truncate">{leg.fromStation} ➔ {leg.toStation}</div>
                          <div className="text-[11px] text-[var(--neu7)] truncate">{leg.durationMinutes} min • {leg.stopsCount} paradas</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11.5px] text-[var(--neu7)] italic mt-1 bg-[var(--surf2)] p-2 rounded-xl">
                    💡 {trip.beginnerTip}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Default Stations List */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg text-[var(--ink)]">
                    {isEs ? "Estaciones del sistema" : "System Stations"}
                  </span>
                  {isLiveApi && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10.5px] font-bold">
                      <Wifi className="w-3 h-3 text-emerald-600 animate-pulse stroke-[2.75]" />
                      {isEs ? "GIS Oficial (22 Líneas)" : "Official GIS (22 Lines)"}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-[var(--neu6)]">
                  {filteredStations.length} {isEs ? "estaciones" : "stations"}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {filteredStations.map((station) => (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => handleSelectStation(station)}
                    className={`text-left w-full border-0 rounded-2xl p-3 px-3.5 flex items-center gap-3 cursor-pointer transition-all border shadow-xs ${
                      selectedStation?.id === station.id
                        ? "bg-[var(--accent-light)] border-[var(--accent)]"
                        : "bg-[var(--surf)] border-[var(--border2)] hover:bg-[var(--surf2)]"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[var(--bg)] text-[var(--accent-dark)] flex items-center justify-center flex-none">
                      <Bus className="w-4.5 h-4.5 stroke-[2.75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-heading text-sm leading-tight truncate text-[var(--ink)]">{station.name}</div>
                      <div className="text-[11.5px] text-[var(--neu7)] truncate">{station.meta}</div>
                    </div>
                    <span className="text-xs font-semibold text-[var(--neu7)] flex-none">{station.dist}</span>
                    <ChevronRight className="w-4 h-4 text-[var(--neu6)] stroke-[2.75]" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


