async function testFoot() {
  // UNAL to CAD station or Draco Hobby
  const lat1 = 4.6382, lng1 = -74.0841;
  const lat2 = 4.6415, lng2 = -74.0658;
  
  const url = `https://router.project-osrm.org/route/v1/foot/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson&steps=true`;
  console.log("Fetching:", url);
  const res = await fetch(url);
  const data = await res.json();
  console.log("Response routes count:", data.routes?.length);
  if (data.routes && data.routes[0]) {
    const route = data.routes[0];
    console.log("Distance:", route.distance, "m");
    console.log("Duration:", route.duration, "s");
    console.log("Coords count:", route.geometry.coordinates.length);
    console.log("First 5 coords:", route.geometry.coordinates.slice(0, 5));
    if (route.legs && route.legs[0] && route.legs[0].steps) {
      console.log("Steps:");
      route.legs[0].steps.forEach((s, i) => {
        console.log(`Step ${i+1}: ${s.maneuver.type} on ${s.name || 'unnamed'} (${s.distance}m)`);
      });
    }
  }
}

testFoot();
