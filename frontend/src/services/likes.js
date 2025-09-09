import api from "../utils/api";

// Obtiene IDs de tags likeados desde el backend
export async function getMyLikedTagIds() {
  try {
    const { data } = await api.get("/me/likes/tags"); // forma 1: array de ids
    if (Array.isArray(data)) return new Set(data.map(Number));

    // forma 2: { tags: [id, ...] }
    if (Array.isArray(data?.tags)) return new Set(data.tags.map(Number));
  } catch {
    // si 404/no auth, devolvemos set vacío
  }
  return new Set();
}

export async function likeTag(tagId) {
  await api.post(`/me/likes/tag/${tagId}`);
}

export async function unlikeTag(tagId) {
  await api.delete(`/me/likes/tag/${tagId}`);
}
