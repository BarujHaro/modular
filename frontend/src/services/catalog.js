import api from "../utils/api";

// Normaliza respuesta del backend a: [{ id, name }]
export async function getTags() {
  const { data } = await api.get("/catalog/tags");
  // Soportar varias formas de respuesta:
  const raw = Array.isArray(data) ? data : (Array.isArray(data?.tags) ? data.tags : []);
  return raw.map((t, i) => {
    if (typeof t === "string") return { id: i + 1, name: t };         // fallback si viniera como strings
    if (t?.id && t?.name) return t;                                   // forma esperada
    // otros posibles campos:
    return { id: t?.tag_id ?? t?.id ?? i + 1, name: t?.tag_name ?? t?.name ?? `tag_${i+1}` };
  });
}
