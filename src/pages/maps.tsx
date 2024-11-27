import { onCleanup, onMount } from "solid-js";
import { createSignal } from "solid-js";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import CSS for leaflet
import { genderData } from '../pages/store';

const MapComponent = () => {
  let mapContainer: HTMLDivElement | undefined;
  let map: L.Map;
  let kabupatenLayer: L.LayerGroup = L.layerGroup([]);
  let provinsiLayer: L.GeoJSON | undefined;
  const [searchQuery, setSearchQuery] = createSignal("");

  // Data GeoJSON provinsi (5 provinsi)
  const provinsiGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      { "type": "Feature", "properties": { "id": 1, "nama": "Jakarta" }, "geometry": { "type": "Point", "coordinates": [106.816666, -6.200000] } },
      { "type": "Feature", "properties": { "id": 2, "nama": "Jawa Barat" }, "geometry": { "type": "Point", "coordinates": [107.619123, -6.917464] } },
      { "type": "Feature", "properties": { "id": 3, "nama": "Jawa Tengah" }, "geometry": { "type": "Point", "coordinates": [110.005912, -7.566977] } },
      { "type": "Feature", "properties": { "id": 4, "nama": "Jawa Timur" }, "geometry": { "type": "Point", "coordinates": [112.752088, -7.257472] } },
      { "type": "Feature", "properties": { "id": 5, "nama": "Bali" }, "geometry": { "type": "Point", "coordinates": [115.216667, -8.650000] } }
    ]
  };

  // Data GeoJSON kabupaten (2 kabupaten per provinsi)
  const kabupatenGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      { "type": "Feature", "properties": { "provinsi_id": 1, "nama": "Jakarta Selatan" }, "geometry": { "type": "Point", "coordinates": [106.800, -6.250] } },
      { "type": "Feature", "properties": { "provinsi_id": 1, "nama": "Jakarta Pusat" }, "geometry": { "type": "Point", "coordinates": [106.850, -6.200] } },
      { "type": "Feature", "properties": { "provinsi_id": 2, "nama": "Bandung" }, "geometry": { "type": "Point", "coordinates": [107.619123, -6.917464] } },
      { "type": "Feature", "properties": { "provinsi_id": 2, "nama": "Bekasi" }, "geometry": { "type": "Point", "coordinates": [106.9896, -6.2383] } },
      { "type": "Feature", "properties": { "provinsi_id": 3, "nama": "Semarang" }, "geometry": { "type": "Point", "coordinates": [110.4203, -6.9667] } },
      { "type": "Feature", "properties": { "provinsi_id": 3, "nama": "Surakarta" }, "geometry": { "type": "Point", "coordinates": [110.8253, -7.556] } },
      { "type": "Feature", "properties": { "provinsi_id": 4, "nama": "Surabaya" }, "geometry": { "type": "Point", "coordinates": [112.752088, -7.257472] } },
      { "type": "Feature", "properties": { "provinsi_id": 4, "nama": "Malang" }, "geometry": { "type": "Point", "coordinates": [112.6304, -7.9786] } },
      { "type": "Feature", "properties": { "provinsi_id": 5, "nama": "Denpasar" }, "geometry": { "type": "Point", "coordinates": [115.216667, -8.650000] } },
      { "type": "Feature", "properties": { "provinsi_id": 5, "nama": "Badung" }, "geometry": { "type": "Point", "coordinates": [115.166667, -8.550000] } }
    ]
  };

  const updateKabupaten = (provinsi_id: number) => {
    if (kabupatenLayer) {
      kabupatenLayer.clearLayers();
    }
    const kabupatenInProvinsi = kabupatenGeoJSON.features.filter(
      (kabupaten: any) => kabupaten.properties.provinsi_id === provinsi_id
    );
    kabupatenLayer = L.layerGroup(
      kabupatenInProvinsi.map((kabupaten: any) =>
        L.marker([kabupaten.geometry.coordinates[1], kabupaten.geometry.coordinates[0]])
          .bindPopup(`<b>${kabupaten.properties.nama}</b>`)
          .on('click', (e: L.LeafletMouseEvent) => {
            onKabupatenClick(e, kabupaten);
          })
      )
    ).addTo(map);
  };

  const onProvinsiClick = (e: L.LeafletMouseEvent, provinsi: any) => {
    map.setView(e.latlng, 8);
    updateKabupaten(provinsi.id);
    provinsiLayer?.remove();
  };

  const onKabupatenClick = (e: L.LeafletMouseEvent, kabupaten: any) => {
    map.setView(e.latlng, 10);
    // Display gender data
    const genderStats = genderData().kabupaten[kabupaten.properties.nama] || { male: 0, female: 0 };
    e.target.bindPopup(`
      <b>${kabupaten.properties.nama}</b><br/>
      Male: ${genderStats.male}<br/>
      Female: ${genderStats.female}
    `).openPopup();
  };

  onMount(() => {
    // Initialize map
    map = L.map(mapContainer!).setView([-2.548926, 118.0148634], 5);

    // Base layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add provinsi layer
    provinsiLayer = L.geoJSON(provinsiGeoJSON, {
      pointToLayer: (feature, latlng) => L.marker(latlng),
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<b>${feature.properties.nama}</b>`);
        layer.on('click', (e: L.LeafletMouseEvent) => {
          onProvinsiClick(e, feature.properties);
        });
      }
    }).addTo(map);

    map.on('zoomend', () => {
      const zoomLevel = map.getZoom();
      if (zoomLevel < 8) {
        provinsiLayer?.addTo(map);
        if (kabupatenLayer) {
          kabupatenLayer.clearLayers();
        }
      }
    });

    onCleanup(() => {
      map.remove();
    });
  });

  const handleSearch = () => {
    const query = searchQuery().toLowerCase();
    let found = false;

    provinsiGeoJSON.features.forEach((provinsi: any) => {
      if (provinsi.properties.nama.toLowerCase().includes(query)) {
        const latlng = L.latLng(provinsi.geometry.coordinates[1], provinsi.geometry.coordinates[0]);
        map.setView(latlng, 8);
        updateKabupaten(provinsi.properties.id);
        provinsiLayer?.remove();
        found = true;
      }
    });

    if (!found) {
      kabupatenGeoJSON.features.forEach((kabupaten: any) => {
        if (kabupaten.properties.nama.toLowerCase().includes(query)) {
          const latlng = L.latLng(kabupaten.geometry.coordinates[1], kabupaten.geometry.coordinates[0]);
          map.setView(latlng, 10);
          found = true;
        }
      });
    }

    if (!found) {
      alert("Lokasi tidak ditemukan");
    }
  };

  return (
    <div>
      <h1 style={{}}>Peta Indonesia</h1>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={searchQuery()}
          onInput={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder="Cari Provinsi atau Kabupaten"
          style={{
            padding: "10px",
            border: "2px solid #ccc",
            width: "300px"
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </div>
      <div ref={mapContainer} style={{
        height: "325px",
        width: "100%",
        border: "5px solid #ccc",
      }}></div>
    </div>
  );
};

export default MapComponent;
