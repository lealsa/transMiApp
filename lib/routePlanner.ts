import { STATIONS_DATABASE, ROUTES_DATABASE, Route, Station } from "./transmilenioData"

export interface TripPlanLeg {
  routeCode: string
  routeName: string
  fromStation: string
  toStation: string
  color: string
  durationMinutes: number
  stopsCount: number
}

export interface TripPlanResult {
  id: string
  type: "direct" | "transfer"
  legs: TripPlanLeg[]
  totalMinutes: number
  transfersCount: number
  transferStationName?: string
  walkMinutes: number
  fare: string
  crowdLevel: "Baja ocupación" | "Ocupación media" | "Alta ocupación"
  crowdColor: string
  beginnerTip: string
}

export function findStationsByName(query: string): Station[] {
  if (!query.trim()) return STATIONS_DATABASE.slice(0, 5)
  const q = query.toLowerCase()
  return STATIONS_DATABASE.filter(
    (s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
  )
}

function getRouteColor(code: string): string {
  const prefix = code.charAt(0).toUpperCase()
  switch (prefix) {
    case "A":
    case "B":
      return "#dc2626" // Red (Caracas / Autopista Norte)
    case "C":
      return "#16a34a" // Green (Suba)
    case "D":
      return "#2563eb" // Blue (Calle 80)
    case "F":
      return "#9333ea" // Purple (Américas)
    case "G":
      return "#059669" // Dark Green (Sur)
    case "H":
      return "#ea580c" // Orange (Usme / Tunal)
    case "J":
      return "#ca8a04" // Yellow (Eje Ambiental)
    case "K":
      return "#d97706" // Gold (Calle 26)
    case "L":
      return "#0284c7" // Sky Blue (Carrera 10)
    case "M":
      return "#db2777" // Pink (Caracas Sur)
    default:
      return "#e11d48" // Rose / Zonal
  }
}

export function planTrip(originQuery: string, destinationQuery: string): TripPlanResult[] {
  const cleanOrigin = originQuery.trim() || "Portal Suba"
  const cleanDest = destinationQuery.trim() || "Calle 26"

  // Match origin & destination stations
  const originStation =
    STATIONS_DATABASE.find((s) => s.name.toLowerCase().includes(cleanOrigin.toLowerCase())) ||
    STATIONS_DATABASE[6] // Portal Suba
  const destStation =
    STATIONS_DATABASE.find((s) => s.name.toLowerCase().includes(cleanDest.toLowerCase())) ||
    STATIONS_DATABASE[12] // Calle 26

  const results: TripPlanResult[] = []

  // 1. SEARCH DIRECT ROUTES IN ROUTES_DATABASE
  ROUTES_DATABASE.forEach((route) => {
    const originIdx = route.stops.findIndex(
      (stop) => stop.stationId === originStation.id || stop.stationName.toLowerCase().includes(originStation.name.toLowerCase())
    )
    const destIdx = route.stops.findIndex(
      (stop) => stop.stationId === destStation.id || stop.stationName.toLowerCase().includes(destStation.name.toLowerCase())
    )

    if (originIdx !== -1 && destIdx !== -1 && originIdx < destIdx) {
      const originStop = route.stops[originIdx]
      const destStop = route.stops[destIdx]
      const duration = Math.max(8, destStop.minutesFromStart - originStop.minutesFromStart)
      const stopsCount = destIdx - originIdx

      results.push({
        id: `direct-${route.code}`,
        type: "direct",
        legs: [
          {
            routeCode: route.code,
            routeName: route.name,
            fromStation: originStation.name,
            toStation: destStation.name,
            color: route.color || getRouteColor(route.code),
            durationMinutes: duration,
            stopsCount,
          },
        ],
        totalMinutes: duration + 4,
        transfersCount: 0,
        walkMinutes: 3,
        fare: "$2.950",
        crowdLevel: "Ocupación media",
        crowdColor: "var(--accent-dark)",
        beginnerTip: `Ruta directa sin cambios de bus. Aborda el bus ${route.code} en la plataforma de ${originStation.name}.`,
      })
    }
  })

  // 2. CHECK COMMON ROUTES IN STATIONS' ROUTE LISTS (e.g. K309, B309, B14, C15, F19, H21)
  const oRoutes = originStation.routes || []
  const dRoutes = destStation.routes || []
  const commonRoutes = oRoutes.filter((r) => dRoutes.includes(r))

  commonRoutes.forEach((code) => {
    if (!results.some((res) => res.legs[0]?.routeCode === code)) {
      const color = getRouteColor(code)
      results.push({
        id: `direct-station-${code}`,
        type: "direct",
        legs: [
          {
            routeCode: code,
            routeName: `${originStation.name} ➔ ${destStation.name}`,
            fromStation: originStation.name,
            toStation: destStation.name,
            color,
            durationMinutes: 24,
            stopsCount: 5,
          },
        ],
        totalMinutes: 28,
        transfersCount: 0,
        walkMinutes: 4,
        fare: "$2.950",
        crowdLevel: "Ocupación media",
        crowdColor: "var(--accent-dark)",
        beginnerTip: `Ruta recomendada ${code} sin cambios de bus entre ${originStation.name} y ${destStation.name}.`,
      })
    }
  })

  // 3. SEARCH 1-TRANSFER ROUTES VIA HUB STATIONS
  if (results.length < 3) {
    const hubStations = STATIONS_DATABASE.filter(
      (s) => s.id === "cll26" || s.id === "cll100" || s.id === "marly" || s.id === "heroes" || s.id === "ricaurte"
    )

    hubStations.forEach((hub) => {
      if (hub.id === originStation.id || hub.id === destStation.id) return

      const r1Code = oRoutes[0] || "B14"
      const r2Code = dRoutes[0] || "C15"

      if (!results.some((res) => res.id === `transfer-${r1Code}-${r2Code}`)) {
        const color1 = getRouteColor(r1Code)
        const color2 = getRouteColor(r2Code)

        results.push({
          id: `transfer-${r1Code}-${r2Code}`,
          type: "transfer",
          legs: [
            {
              routeCode: r1Code,
              routeName: `${originStation.name} ➔ ${hub.name}`,
              fromStation: originStation.name,
              toStation: hub.name,
              color: color1,
              durationMinutes: 16,
              stopsCount: 4,
            },
            {
              routeCode: r2Code,
              routeName: `${hub.name} ➔ ${destStation.name}`,
              fromStation: hub.name,
              toStation: destStation.name,
              color: color2,
              durationMinutes: 14,
              stopsCount: 3,
            },
          ],
          totalMinutes: 36,
          transfersCount: 1,
          transferStationName: hub.name,
          walkMinutes: 3,
          fare: "$2.950",
          crowdLevel: "Baja ocupación",
          crowdColor: "var(--sage-text)",
          beginnerTip: `Realiza un transbordo en la estación ${hub.name}. No requiere pagar pasaje adicional.`,
        })
      }
    })
  }

  // 4. DYNAMIC FALLBACK MATCHING ORIGIN'S BEST ROUTE
  if (results.length === 0) {
    const fallbackRouteCode = oRoutes[0] || dRoutes[0] || "B14"
    const color = getRouteColor(fallbackRouteCode)

    results.push({
      id: `fallback-${fallbackRouteCode}`,
      type: "direct",
      legs: [
        {
          routeCode: fallbackRouteCode,
          routeName: `${originStation.name} ➔ ${destStation.name}`,
          fromStation: originStation.name,
          toStation: destStation.name,
          color,
          durationMinutes: 28,
          stopsCount: 5,
        },
      ],
      totalMinutes: 32,
      transfersCount: 0,
      walkMinutes: 4,
      fare: "$2.950",
      crowdLevel: "Ocupación media",
      crowdColor: "var(--accent-dark)",
      beginnerTip: `Ruta principal ${fallbackRouteCode} desde ${originStation.name} hasta ${destStation.name}.`,
    })
  }

  return results
}



