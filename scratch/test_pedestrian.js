async function testPedestrian() {
  const p1 = [4.6415, -74.0658]; // Draco Hobby
  const p2 = [4.6382, -74.0841]; // UNAL

  const osrmFootUrl = `https://router.project-osrm.org/route/v1/foot/${p1[1]},${p1[0]};${p2[1]},${p2[0]}?overview=full&geometries=geojson&steps=true`;
  
  try {
    const res = await fetch(osrmFootUrl);
    const json = await res.json();
    console.log("OSRM Foot Status:", json.code);
    if (json.routes && json.routes[0]) {
      console.log("OSRM Foot Distance:", json.routes[0].distance, "m");
      console.log("OSRM Foot Duration:", Math.round(json.routes[0].duration / 60), "min");
      console.log("OSRM Foot Geometry Coords:", json.routes[0].geometry.coordinates.length);
    }
  } catch (e) {
    console.error("OSRM Foot error:", e);
  }
}

testPedestrian();
