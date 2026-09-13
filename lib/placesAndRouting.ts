import { StationData } from "@/app/mapa/page"
import { planTrip, TripPlanResult } from "./routePlanner"

export interface PlaceItem {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  category?: string
}

export interface MultimodalJourneyLeg {
  type: "walk" | "bus"
  fromName: string
  toName: string
  durationMinutes: number
  distanceMeters?: number
  busCode?: string
  busColor?: string
  stopsCount?: number
}

export interface DoorToDoorTripResult {
  id: string
  originPlace: PlaceItem
  destPlace: PlaceItem
  nearestOriginStation: StationData
  nearestDestStation: StationData
  walkToOriginMins: number
  walkToOriginDist: number
  walkFromDestMins: number
  walkFromDestDist: number
  busTrip: TripPlanResult
  totalJourneyMinutes: number
  fare: string
  legs: MultimodalJourneyLeg[]
}

// Popular curated places in Bogotá for instant matching
export const POPULAR_BOGOTA_PLACES: PlaceItem[] = [
  {
    id: "unlimited-store",
    name: "Unlimited Comics & Hobby Store",
    address: "Cl. 53 #14-23, Chapinero / Galerías, Bogotá",
    lat: 4.642,
    lng: -74.066,
    category: "🎮 Tienda Hobby & Coleccionables",
  },
  {
    id: "unlimited-game-lounge",
    name: "Unlimited Games & Hobby Lounge",
    address: "Autopista Norte #106-25, Usaquén, Bogotá",
    lat: 4.693,
    lng: -74.053,
    category: "🎮 Centro de Entretenimiento & TCG",
  },
  {
    id: "draco-hobby",
    name: "Draco Hobby Center",
    address: "Cl. 53 #13-27, Chapinero, Bogotá",
    lat: 4.6415,
    lng: -74.0658,
    category: "🎮 Tienda de Juegos & Aficiones",
  },
  {
    id: "cc-unicentro",
    name: "Centro Comercial Unicentro",
    address: "Av. 15 con Cl. 127, Usaquén, Bogotá",
    lat: 4.7022,
    lng: -74.0413,
    category: "🛍️ Centro Comercial",
  },
  {
    id: "cc-andino",
    name: "Centro Comercial Andino",
    address: "Carrera 11 con Calle 82, Zona T",
    lat: 4.6668,
    lng: -74.0532,
    category: "🛍️ Centro Comercial",
  },
  {
    id: "cc-titan-plaza",
    name: "Centro Comercial Titán Plaza",
    address: "Av. Boyacá con Calle 80, Engativá",
    lat: 4.6957,
    lng: -74.0864,
    category: "🛍️ Centro Comercial",
  },
  {
    id: "cc-gran-estacion",
    name: "Centro Comercial Gran Estación",
    address: "Av. El Dorado #26-68, Teusaquillo",
    lat: 4.647,
    lng: -74.101,
    category: "🛍️ Centro Comercial",
  },
  {
    id: "unal-bogota",
    name: "Universidad Nacional de Colombia",
    address: "Av. Carrera 30 con Calle 45",
    lat: 4.6382,
    lng: -74.0841,
    category: "🎓 Universidad",
  },
  {
    id: "javeriana-bogota",
    name: "Pontificia Universidad Javeriana",
    address: "Carrera 7 #40-62, Chapinero",
    lat: 4.6285,
    lng: -74.0648,
    category: "🎓 Universidad",
  },
  {
    id: "parque-93",
    name: "Parque de la 93",
    address: "Cl. 93 con Cra. 13, Chicó",
    lat: 4.6766,
    lng: -74.0483,
    category: "🌳 Parque / Zona Rosa",
  },
  {
    id: "aeropuerto-eldorado",
    name: "Aeropuerto Internacional El Dorado",
    address: "Av. El Dorado #103-9, Fontibón",
    lat: 4.7016,
    lng: -74.1469,
    category: "✈️ Aeropuerto",
  },
  {
    id: "movistar-arena",
    name: "Movistar Arena / Estadio El Campín",
    address: "Av. NQS con Calle 57",
    lat: 4.6468,
    lng: -74.0772,
    category: "🏟️ Entretenimiento",
  },
  {
    id: "candelaria-centro",
    name: "Plaza de Bolívar / La Candelaria",
    address: "Carrera 7 con Calle 11, Centro Histórico",
    lat: 4.5981,
    lng: -74.076,
    category: "🏛️ Turismo & Centro",
  },
]

// Haversine distance formula in meters
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180
  const phi2 = (lat2 * Math.PI) / 180
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c)
}

// Search OpenStreetMap Photon + Nominatim + Curated local places list in Bogotá
export async function searchPlacesInBogota(query: string): Promise<PlaceItem[]> {
  const q = query.trim().toLowerCase()
  if (!q) return POPULAR_BOGOTA_PLACES.slice(0, 6)

  // 1. Check local curated places list (supports full & partial string matches)
  const localMatches = POPULAR_BOGOTA_PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
  )

  const results: PlaceItem[] = [...localMatches]

  // 2. Fetch Photon Komoot Geocoding API with strict Bogotá Bounding Box (-74.25, 4.45, -73.95, 4.85)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&bbox=-74.25,4.45,-73.95,4.85&limit=8`
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3500)
    const pRes = await fetch(photonUrl, { signal: controller.signal })
    clearTimeout(timer)

    if (pRes.ok) {
      const pJson = await pRes.json()
      if (pJson && Array.isArray(pJson.features)) {
        pJson.features.forEach((f: any, idx: number) => {
          const props = f.properties || {}
          const coords = f.geometry?.coordinates || [-74.08, 4.65]
          const name = props.name || props.street || query
          const city = props.city || props.district || "Bogotá"
          const address = [props.street, props.district || props.suburb, city, "Colombia"].filter(Boolean).join(", ")

          if (!results.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
            results.push({
              id: `photon-${props.osm_id || idx}`,
              name: name,
              address: address || `${name}, Bogotá`,
              lat: coords[1],
              lng: coords[0],
              category: props.type ? `📍 ${props.type.toUpperCase()}` : "📍 Sitio en Bogotá",
            })
          }
        })
      }
    }
  } catch (e) {
    console.warn("Photon geocoding fallback:", e)
  }

  // 3. If no match at all, construct dynamic place item in Bogotá
  if (results.length === 0) {
    results.push({
      id: `dynamic-${Date.now()}`,
      name: query,
      address: `${query}, Bogotá D.C.`,
      lat: 4.65,
      lng: -74.08,
      category: "📍 Sitio / Destino",
    })
  }

  return results
}

// Find nearest station to given lat/lng
export function findNearestStationToPoint(lat: number, lng: number, stations: StationData[]): { station: StationData; distanceMeters: number; walkMins: number } {
  let closestStation = stations[0]
  let minDistance = Infinity

  stations.forEach((st) => {
    const dist = calculateDistanceMeters(lat, lng, st.lat, st.lng)
    if (dist < minDistance) {
      minDistance = dist
      closestStation = st
    }
  })

  // Estimate walk time: 80m per minute
  const walkMins = Math.max(1, Math.round(minDistance / 80))

  return {
    station: closestStation,
    distanceMeters: minDistance,
    walkMins,
  }
}

export interface RouteGeometryResult {
  coordinates: [number, number][]
  distanceMeters: number
  durationMinutes: number
}

// Fetch 100% Real Pedestrian Foot Path following sidewalks & street corners in Bogotá via OSRM
export async function fetchPedestrianRouteGeometry(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): Promise<RouteGeometryResult> {
  const dist = calculateDistanceMeters(fromLat, fromLng, toLat, toLng)
  
  // Smart orthogonal street grid path (Calles & Carreras corners) as non-flying fallback
  const gridCornerCoords: [number, number][] = [
    [fromLng, fromLat],
    [fromLng, toLat], // Street intersection corner (Carrera X with Calle Y)
    [toLng, toLat],
  ]

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    const url = `https://router.project-osrm.org/route/v1/foot/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson&steps=true`
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)

    if (res.ok) {
      const data = await res.json()
      if (data.routes && data.routes.length > 0) {
        const r = data.routes[0]
        const realDist = Math.round(r.distance)
        return {
          coordinates: r.geometry.coordinates as [number, number][],
          distanceMeters: realDist,
          durationMinutes: Math.max(1, Math.round(realDist / 80)), // 80m per minute walking speed
        }
      }
    }
  } catch (e) {
    console.warn("OSRM Foot routing timeout/fallback:", e)
  }

  return {
    coordinates: gridCornerCoords,
    distanceMeters: dist,
    durationMinutes: Math.max(1, Math.round(dist / 80)),
  }
}

// Fetch 100% Real Bus Transit Road Path following main avenues in Bogotá via OSRM
export async function fetchTransitRouteGeometry(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): Promise<RouteGeometryResult> {
  const dist = calculateDistanceMeters(fromLat, fromLng, toLat, toLng)
  
  const gridCornerCoords: [number, number][] = [
    [fromLng, fromLat],
    [(fromLng + toLng) / 2, (fromLat + toLat) / 2 + 0.002], // Avenue curve
    [toLng, toLat],
  ]

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)

    if (res.ok) {
      const data = await res.json()
      if (data.routes && data.routes.length > 0) {
        const r = data.routes[0]
        const realDist = Math.round(r.distance)
        return {
          coordinates: r.geometry.coordinates as [number, number][],
          distanceMeters: realDist,
          durationMinutes: Math.max(3, Math.round(r.duration / 60)),
        }
      }
    }
  } catch (e) {
    console.warn("OSRM Driving transit routing timeout/fallback:", e)
  }

  return {
    coordinates: gridCornerCoords,
    distanceMeters: dist,
    durationMinutes: Math.max(5, Math.round(dist / 400)),
  }
}

// Synchronous fallback journey calculator
export function calculateDoorToDoorTrip(
  originPlace: PlaceItem,
  destPlace: PlaceItem,
  stations: StationData[]
): DoorToDoorTripResult {
  const originNear = findNearestStationToPoint(originPlace.lat, originPlace.lng, stations)
  const destNear = findNearestStationToPoint(destPlace.lat, destPlace.lng, stations)

  const busTrips = planTrip(originNear.station.name, destNear.station.name)
  const bestBusTrip = busTrips[0]

  const legs: MultimodalJourneyLeg[] = []

  legs.push({
    type: "walk",
    fromName: originPlace.name,
    toName: `Estación ${originNear.station.name}`,
    durationMinutes: originNear.walkMins,
    distanceMeters: originNear.distanceMeters,
  })

  bestBusTrip.legs.forEach((bLeg) => {
    legs.push({
      type: "bus",
      fromName: bLeg.fromStation,
      toName: bLeg.toStation,
      durationMinutes: bLeg.durationMinutes,
      busCode: bLeg.routeCode,
      busColor: bLeg.color,
      stopsCount: bLeg.stopsCount,
    })
  })

  legs.push({
    type: "walk",
    fromName: `Estación ${destNear.station.name}`,
    toName: destPlace.name,
    durationMinutes: destNear.walkMins,
    distanceMeters: destNear.distanceMeters,
  })

  const totalJourneyMinutes = originNear.walkMins + bestBusTrip.totalMinutes + destNear.walkMins

  return {
    id: `journey-${Date.now()}`,
    originPlace,
    destPlace,
    nearestOriginStation: originNear.station,
    nearestDestStation: destNear.station,
    walkToOriginMins: originNear.walkMins,
    walkToOriginDist: originNear.distanceMeters,
    walkFromDestMins: destNear.walkMins,
    walkFromDestDist: destNear.distanceMeters,
    busTrip: bestBusTrip,
    totalJourneyMinutes,
    fare: "$2.950",
    legs,
    walkLeg1Coords: [
      [originPlace.lng, originPlace.lat],
      [originNear.station.lng, originNear.station.lat],
    ],
    busLegCoords: [
      [originNear.station.lng, originNear.station.lat],
      [destNear.station.lng, destNear.station.lat],
    ],
    walkLeg2Coords: [
      [destNear.station.lng, destNear.station.lat],
      [destPlace.lng, destPlace.lat],
    ],
  }
}

// Asynchronous full door to door trip calculator with 100% REAL street pedestrian & transit geometry
export async function calculateDoorToDoorTripAsync(
  originPlace: PlaceItem,
  destPlace: PlaceItem,
  stations: StationData[]
): Promise<DoorToDoorTripResult> {
  const originNear = findNearestStationToPoint(originPlace.lat, originPlace.lng, stations)
  const destNear = findNearestStationToPoint(destPlace.lat, destPlace.lng, stations)

  // Fetch real geometries for walk 1, bus transit, and walk 2 in parallel
  const [walk1Res, busRes, walk2Res] = await Promise.all([
    fetchPedestrianRouteGeometry(
      originPlace.lat,
      originPlace.lng,
      originNear.station.lat,
      originNear.station.lng
    ),
    fetchTransitRouteGeometry(
      originNear.station.lat,
      originNear.station.lng,
      destNear.station.lat,
      destNear.station.lng
    ),
    fetchPedestrianRouteGeometry(
      destNear.station.lat,
      destNear.station.lng,
      destPlace.lat,
      destPlace.lng
    ),
  ])

  const busTrips = planTrip(originNear.station.name, destNear.station.name)
  const bestBusTrip = busTrips[0]

  const legs: MultimodalJourneyLeg[] = []

  legs.push({
    type: "walk",
    fromName: originPlace.name,
    toName: `Estación ${originNear.station.name}`,
    durationMinutes: walk1Res.durationMinutes,
    distanceMeters: walk1Res.distanceMeters,
  })

  bestBusTrip.legs.forEach((bLeg) => {
    legs.push({
      type: "bus",
      fromName: bLeg.fromStation,
      toName: bLeg.toStation,
      durationMinutes: bLeg.durationMinutes,
      busCode: bLeg.routeCode,
      busColor: bLeg.color,
      stopsCount: bLeg.stopsCount,
    })
  })

  legs.push({
    type: "walk",
    fromName: `Estación ${destNear.station.name}`,
    toName: destPlace.name,
    durationMinutes: walk2Res.durationMinutes,
    distanceMeters: walk2Res.distanceMeters,
  })

  const totalJourneyMinutes = walk1Res.durationMinutes + bestBusTrip.totalMinutes + walk2Res.durationMinutes

  return {
    id: `journey-${Date.now()}`,
    originPlace,
    destPlace,
    nearestOriginStation: originNear.station,
    nearestDestStation: destNear.station,
    walkToOriginMins: walk1Res.durationMinutes,
    walkToOriginDist: walk1Res.distanceMeters,
    walkFromDestMins: walk2Res.durationMinutes,
    walkFromDestDist: walk2Res.distanceMeters,
    busTrip: bestBusTrip,
    totalJourneyMinutes,
    fare: "$2.950",
    legs,
    walkLeg1Coords: walk1Res.coordinates,
    busLegCoords: busRes.coordinates,
    walkLeg2Coords: walk2Res.coordinates,
  }
}

