const center = [25.50124, -103.55115];
const zoom = 16;

// Crear mapa
const map = L.map("map").setView(center, zoom);

// Capa base
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// ✅ Icono personalizado
const customIcon = L.icon({
  iconUrl: "img/icons/ft.ico.ico", // ajusta ruta
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// 🔥 Cargar datos desde Supabase
async function cargarLugares() {
  const { data, error } = await supabase.from("lugares").select("*");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach((lugar) => {
    const marker = L.marker([lugar.lat, lugar.lng], {
      icon: customIcon,
    }).addTo(map);

    // Popup con link
    marker.bindPopup(`
      <a href="${lugar.url}" target="_blank" style="color:#d33; text-decoration:none;">
        ${lugar.nombre}
      </a>
    `);

    // Abrir popup automáticamente (opcional)
    marker.openPopup();

    // Click directo abre link
    marker.on("click", () => {
      window.open(lugar.url, "_blank");
    });
  });
}

// Ejecutar
cargarLugares();
