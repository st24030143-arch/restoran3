document.addEventListener("DOMContentLoaded", () => {
  // 🔥 SUPABASE
  const supaBaseUrl = "https://giuwobwqahtfqryfjyxn.supabase.co";
  const supaBaseKey = "sb_publishable_X88gVn9ORm5lXz99FeldiA_XHLxGRkI";

  const supabase = window.supabase.createClient(supaBaseUrl, supaBaseKey);

  // Centro inicial
  const center = [25.5732, -103.4948];
  const zoom = 16;

  // Crear mapa
  const map = L.map("map").setView(center, zoom);

  // Capa
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // 🔥 FIX DEL TEMPLATE
  setTimeout(() => {
    map.invalidateSize();
  }, 500);

  // Marcador inicial
  L.marker(center).addTo(map).bindPopup("Ubicación inicial").openPopup();

  // Icono (usa png seguro)
  const customIcon = L.icon({
    iconUrl: "img/icons/ft.ico.ico",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  // Elementos
  const dialog = document.querySelector(".popup");
  const inputLatitude = document.querySelector(".input-latitude");
  const inputLongitude = document.querySelector(".input-longitude");
  const buttonSave = document.querySelector(".button-save");
  const buttonCancel = document.querySelector(".button-cancel");
  const placeName = document.querySelector(".place-name");
  const betweenStreets = document.querySelector(".between-streets");

  // 🔥 CARGAR DATOS
  async function cargarUbicaciones() {
    const { data, error } = await supabase.from("coordinates").select("*");

    if (error) {
      console.error("Error cargando:", error);
      return;
    }

    data.forEach((loc) => {
      L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map).bindPopup(`
          <b>${loc.placeName}</b><br>
          ${loc.betweenstreets || ""}
        `);
    });
  }

  cargarUbicaciones();

  // Marcador dinámico
  let clickMarker = null;
  let currentLat = null;
  let currentLng = null;

  // CLICK MAPA
  map.on("click", (e) => {
    const { lat, lng } = e.latlng;

    currentLat = lat;
    currentLng = lng;

    inputLatitude.value = lat.toFixed(6);
    inputLongitude.value = lng.toFixed(6);

    dialog.showModal();

    if (clickMarker) {
      map.removeLayer(clickMarker);
    }

    clickMarker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
  });

  // CANCELAR
  buttonCancel.addEventListener("click", () => {
    dialog.close();
  });

  // GUARDAR
  buttonSave.addEventListener("click", async () => {
    const name = placeName.value;
    const streets = betweenStreets.value;

    L.marker([currentLat, currentLng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>${name}</b><br>${streets}`)
      .openPopup();

    await supabase.from("coordinates").insert([
      {
        lat: currentLat,
        lng: currentLng,
        placeName: name,
        betweenstreets: streets,
      },
    ]);

    dialog.close();
  });
});
