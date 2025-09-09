// backend/routes/LikesRoute.js
import { Router } from "express";
import verifyToken from "../middleware/verifytoken.js";
import sequelize from "../config/database.js";

const router = Router();

// protegemos todo lo que cuelga de este router
router.use(verifyToken);

// Detecta el modelo de unión sin depender del nombre exacto exportado
const LikeModel =
  sequelize.models.UserTagLike ||
  sequelize.models.UserLikedTag ||
  sequelize.models.user_tag_likes; // posible nombre del through

if (!LikeModel) {
  console.error(
    "[LikesRoute] No se encontró el modelo de unión (UserTagLike/UserLikedTag/user_tag_likes). " +
    "La API responderá vacío hasta que lo definas."
  );
}

// GET /api/me/likes  -> devuelve ids de tags con like
router.get("/me/likes", async (req, res) => {
  try {
    if (!LikeModel) return res.json({ likedTagIds: [] });
    const likes = await LikeModel.findAll({
      where: { userId: req.user.id },
      attributes: ["tagId"],
      order: [["tagId", "ASC"]],
    });
    res.json({ likedTagIds: likes.map((x) => x.tagId) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error obteniendo likes" });
  }
});

// POST /api/me/likes/tag/:tagId  -> crea like
router.post("/me/likes/tag/:tagId", async (req, res) => {
  try {
    if (!LikeModel) return res.status(500).json({ error: "Modelo de likes no definido" });
    const { tagId } = req.params;
    await LikeModel.findOrCreate({ where: { userId: req.user.id, tagId } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error creando like" });
  }
});

// DELETE /api/me/likes/tag/:tagId  -> borra like
router.delete("/me/likes/tag/:tagId", async (req, res) => {
  try {
    if (!LikeModel) return res.status(500).json({ error: "Modelo de likes no definido" });
    const { tagId } = req.params;
    await LikeModel.destroy({ where: { userId: req.user.id, tagId } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error eliminando like" });
  }
});

export default router;
