// Let's test photon geocoding directly via fetch
async function testSearch() {
  const queries = ["Draco Hobby Center", "Unlimited", "Unicentro", "Universidad Nacional"];
  
  for (const q of queries) {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=4.65&lon=-74.08&limit=5`;
    const res = await fetch(photonUrl);
    const json = await res.json();
    console.log(`\nQuery: "${q}"`);
    console.log(`Photon features count:`, json.features?.length || 0);
    if (json.features && json.features.length > 0) {
      json.features.slice(0, 3).forEach((f, i) => {
        console.log(`  ${i+1}. ${f.properties.name} (${f.properties.street || ''}, ${f.properties.city || ''}) [${f.geometry.coordinates.join(', ')}]`);
      });
    }
  }
}

testSearch();
