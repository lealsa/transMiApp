async function testBboxSearch() {
  const queries = ["Draco Hobby Center", "Unlimited", "Unicentro", "Universidad Nacional", "Galerias", "Chapinero", "Calle 26"];
  
  for (const q of queries) {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&bbox=-74.25,4.45,-73.95,4.85&limit=5`;
    const res = await fetch(photonUrl);
    const json = await res.json();
    console.log(`\nQuery with bbox: "${q}"`);
    console.log(`Photon features count:`, json.features?.length || 0);
    if (json.features && json.features.length > 0) {
      json.features.forEach((f, i) => {
        console.log(`  ${i+1}. ${f.properties.name || f.properties.street} (${f.properties.district || ''}, ${f.properties.city || 'Bogotá'}) [${f.geometry.coordinates.join(', ')}]`);
      });
    }
  }
}

testBboxSearch();
