// Client & Server fetcher for Official TransMilenio S.A. GIS REST API

export interface RealStation {
  id: string
  name: string
  zone: string
  address: string
  lat: number
  lng: number
  isPortal: boolean
  accessible: boolean
  crowdLevel: "low" | "medium" | "high"
  wagons: number
  nodeCode: number
  routes: string[]
}

export interface RealTroncal {
  id: string
  name: string
  code: string
  origin: string
  destination: string
  lengthKm: number
}

export interface RealPolylineLine {
  id: string
  name: string
  trunkCode: string
  color: string
  coordinates: [number, number][]
}

const OFFICIAL_STATIONS_URL =
  "https://gis.transmilenio.gov.co/arcgis/rest/services/ConsultaSubgerenciaPlanificacionSITP/Consulta_Planificacion_SITP/FeatureServer/2/query?where=1%3D1&outFields=*&outSR=4326&returnGeometry=true&f=json"

const OFFICIAL_TRAZADOS_URL =
  "https://gis.transmilenio.gov.co/arcgis/rest/services/ConsultaSubgerenciaPlanificacionSITP/Consulta_Planificacion_SITP/FeatureServer/5/query?where=1%3D1&outFields=*&outSR=4326&returnGeometry=true&f=json"

export function getTrunkColor(code: string): string {
  const c = code.toUpperCase()
  if (c === "A") return "#00509d" // Caracas (Blue)
  if (c === "B") return "#10b981" // Auto Norte (Green)
  if (c === "C") return "#f59e0b" // Suba (Yellow/Gold)
  if (c === "D") return "#8b5cf6" // Calle 80 (Purple)
  if (c === "E") return "#8d5b4c" // NQS Central (Brown)
  if (c === "F") return "#ef4444" // Américas (Red)
  if (c === "G") return "#1e3a8a" // NQS Sur / Soacha (Navy)
  if (c === "H") return "#f97316" // Tunal / Usme (Orange)
  if (c === "J") return "#d97706" // Eje Ambiental (Amber)
  if (c === "K") return "#c67139" // Calle 26 (Terracotta)
  if (c === "L") return "#14b8a6" // Carrera 10 (Teal)
  if (c === "M") return "#06b6d4" // Carrera 7 (Cyan)
  return "#c67139"
}

// Map official trunk code to zone letter
function getZoneFromTrazado(trazado: string, name: string): string {
  if (name.toLowerCase().includes("norte") || trazado === "TZ001") return "B"
  if (name.toLowerCase().includes("suba") || trazado === "TZ004") return "C"
  if (name.toLowerCase().includes("80") || trazado === "TZ003") return "D"
  if (name.toLowerCase().includes("dorado") || name.toLowerCase().includes("26") || trazado === "TZ006") return "K"
  if (name.toLowerCase().includes("americas") || trazado === "TZ007") return "F"
  if (name.toLowerCase().includes("tunal") || name.toLowerCase().includes("usme") || trazado === "TZ009") return "H"
  if (name.toLowerCase().includes("soacha") || name.toLowerCase().includes("sur")) return "G"
  if (name.toLowerCase().includes("décima") || name.toLowerCase().includes("10")) return "L"
  if (name.toLowerCase().includes("caracas") || trazado === "TZ005") return "A"
  if (name.toLowerCase().includes("eje") || name.toLowerCase().includes("aguas")) return "J"
  return "A"
}

// Generate realistic routes passing through a station based on its zone and portal status
function getRoutesForStation(name: string, zone: string, isPortal: boolean): string[] {
  const baseRoutes: string[] = []
  if (zone === "B") baseRoutes.push("B1", "B14", "B75", "B12", "H72")
  else if (zone === "C") baseRoutes.push("C19", "K9", "C15", "C25", "H21")
  else if (zone === "K") baseRoutes.push("K9", "K10", "K86", "K16", "K54")
  else if (zone === "F") baseRoutes.push("F23", "J24", "F14", "F32", "F60")
  else if (zone === "H") baseRoutes.push("H15", "H72", "H75", "H21", "A61")
  else if (zone === "G") baseRoutes.push("G12", "G43", "G11")
  else if (zone === "D") baseRoutes.push("D10", "D20", "D22")
  else if (zone === "J") baseRoutes.push("J23", "J24", "J74")
  else baseRoutes.push("B1", "B14", "H15", "K9", "F23", "H72", "J24", "A61")

  if (isPortal) {
    baseRoutes.push("Alimentador", "Ruta Dual")
  }
  return Array.from(new Set(baseRoutes))
}

export async function fetchRealTransmilenioStations(): Promise<RealStation[]> {
  try {
    const res = await fetch(OFFICIAL_STATIONS_URL, {
      headers: { "User-Agent": "TransMiApp/1.0" },
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`HTTP error ${res.status}`)

    const data = await res.json()
    if (!data.features || !Array.isArray(data.features)) return []

    return data.features
      .filter((f: any) => f.attributes && f.attributes.nom_est && (f.geometry || (f.attributes.latitud && f.attributes.longitud)))
      .map((f: any) => {
        const attr = f.attributes
        const geom = f.geometry || {}
        
        // Exact WGS84 coordinates from official GIS geometry (y = latitude, x = longitude)
        const lat = Number(geom.y || attr.latitud)
        const lng = Number(geom.x || attr.longitud)

        const rawName = String(attr.nom_est || "").trim()
        const isPortal = rawName.toLowerCase().startsWith("portal") || rawName.toLowerCase().includes("portal")
        const zone = getZoneFromTrazado(attr.id_trazado || "", rawName)
        const wagons = Number(attr.num_vag) || 1
        const capacity = Number(attr.cap_art) || 100
        
        const crowdLevel: "low" | "medium" | "high" =
          capacity > 180 ? "high" : capacity > 120 ? "medium" : "low"

        const accessible = (Number(attr.acc_puent) || 0) > 0 || (Number(attr.num_acc) || 0) > 0

        return {
          id: String(attr.num_est || attr.objectid || Math.random().toString()),
          name: rawName,
          zone,
          address: String(attr.ub_est || "Bogotá D.C.").trim(),
          lat,
          lng,
          isPortal,
          accessible,
          crowdLevel,
          wagons,
          nodeCode: Number(attr.cod_nodo) || 0,
          routes: getRoutesForStation(rawName, zone, isPortal),
        }
      })
  } catch (error) {
    console.error("Failed to fetch real TransMilenio stations from official GIS:", error)
    return []
  }
}

export async function fetchRealTransmilenioTroncalesPolylines(): Promise<RealPolylineLine[]> {
  try {
    const res = await fetch(OFFICIAL_TRAZADOS_URL, {
      headers: { "User-Agent": "TransMiApp/1.0" },
      next: { revalidate: 86400 },
    })

    if (!res.ok) throw new Error(`HTTP error ${res.status}`)

    const data = await res.json()
    if (!data.features || !Array.isArray(data.features)) return []

    const polylines: RealPolylineLine[] = []

    data.features.forEach((f: any) => {
      const attr = f.attributes || {}
      const trunkCode = String(attr.le_troncal || "A")
      const name = String(attr.nom_traz || attr.nom_tronc || "Troncal")
      const color = getTrunkColor(trunkCode)

      if (f.geometry && f.geometry.paths && Array.isArray(f.geometry.paths)) {
        f.geometry.paths.forEach((path: number[][], idx: number) => {
          if (Array.isArray(path) && path.length > 1) {
            const coordinates = path.map((pt) => [pt[0], pt[1]] as [number, number])
            polylines.push({
              id: `${attr.id_trazado || attr.objectid}-${idx}`,
              name,
              trunkCode,
              color,
              coordinates,
            })
          }
        })
      }
    })

    return polylines
  } catch (error) {
    console.error("Failed to fetch real TransMilenio polylines:", error)
    return []
  }
}

const OFFICIAL_RUTAS_URL =
  "https://gis.transmilenio.gov.co/arcgis/rest/services/Troncal/consulta_rutas_troncales/MapServer/0/query?where=1%3D1&outFields=*&f=json"

export async function fetchRealTransmilenioRutasList(): Promise<any[]> {
  try {
    const res = await fetch(OFFICIAL_RUTAS_URL, {
      headers: { "User-Agent": "TransMiApp/1.0" },
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`HTTP error ${res.status}`)

    const data = await res.json()
    if (!data.features || !Array.isArray(data.features)) return []

    const routesMap = new Map<string, any>()

    data.features.forEach((f: any) => {
      const a = f.attributes || {}
      const code = String(a.nombre_ruta_troncal || a.route_name_ruta_troncal || "").trim()
      if (!code || routesMap.has(code)) return

      const origin = String(a.origen_ruta_troncal || "Origen").trim()
      const destination = String(a.destino_ruta_troncal || "Destino").trim()
      const busType = String(a.desc_tipo_bus_ruta_troncal || a.desc_tipo_ruta_troncal || "TRONCAL").toUpperCase()
      
      let type: "troncal" | "dual" | "zonal" | "alimentadora" = "troncal"
      if (busType.includes("DUAL")) type = "dual"
      else if (busType.includes("ALIMENTA")) type = "alimentadora"

      const color = getTrunkColor(code)

      routesMap.set(code, {
        code,
        name: `${origin} ➔ ${destination}`,
        type,
        color,
        origin,
        destination,
        frequencyPeak: busType.includes("BIARTICULADO") ? "3 - 5 min" : "4 - 6 min",
        hoursWeekday: String(a.horario_lunes_viernes || "04:30 - 23:00").trim(),
        hoursSaturday: String(a.horario_sabado || "05:00 - 23:00").trim(),
        hoursSunday: String(a.horario_domingo_festivo || "05:30 - 22:00").trim(),
      })
    })

    return Array.from(routesMap.values())
  } catch (error) {
    console.error("Failed to fetch real TransMilenio routes list:", error)
    return []
  }
}


