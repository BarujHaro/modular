// backend/routes/AuthRoute.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 👇 Importa TODO lo que exporte models/index.js (sin asumir "default")
import * as db from "../models/index.js";

import verifyToken from "../middleware/verifytoken.js";

const router = Router();

/** Intenta resolver el modelo User sin asumir la forma exacta de export */
function resolveUserModel() {
  // a) ¿exportaron directamente el modelo como named export?
  const direct =
    db.user ||
    db.User ||
    db.users ||
    db.Users;

  if (direct?.findOne) return direct;

  // b) ¿exponen la instancia de sequelize?
  const orm =
    db.sequelize ||
    db.orm ||
    db.db ||
    db.connection;

  const fromOrm =
    orm?.models?.user ||
    orm?.models?.User ||
    orm?.models?.users ||
    orm?.models?.Users;

  if (fromOrm?.findOne) return fromOrm;

  // c) ¿hay algún objeto "models" empaquetado?
  const packed =
    db.models?.user ||
    db.models?.User ||
    db.models?.users ||
    db.models?.Users;

  if (packed?.findOne) return packed;

  throw new Error("No pude resolver el modelo User desde models/index.js");
}

const User = resolveUserModel();

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

/**
 * POST /api/auth/login  (PÚBLICO)
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ msg: "Email y password son requeridos" });
    }

    const u = await User.findOne({ where: { email } });
    if (!u) return res.status(401).json({ msg: "Credenciales inválidas" });

    // Campos posibles según tu esquema
    const hash = u.password || u.dataValues?.password;
    const ok = await bcrypt.compare(password, hash);
    if (!ok) return res.status(401).json({ msg: "Credenciales inválidas" });

    const token = signToken({ id: u.id, role: u.role || "user" });

    return res.json({
      token,
      user: {
        id: u.id,
        firstName: u.first_name ?? u.firstName ?? u.dataValues?.first_name ?? u.dataValues?.firstName ?? "",
        lastName:  u.last_name  ?? u.lastName  ?? u.dataValues?.last_name  ?? u.dataValues?.lastName  ?? "",
        email: u.email,
        role: u.role || "user",
      }
    });
  } catch (e) {
    console.error("POST /auth/login error:", e);
    return res.status(500).json({ msg: "login_failed" });
  }
});

/**
 * GET /api/auth/me  (PROTEGIDO)
 * header: Authorization: Bearer <token>
 */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const u = await User.findByPk(req.user.id);
    if (!u) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json({
      id: u.id,
      firstName: u.first_name ?? u.firstName ?? "",
      lastName:  u.last_name  ?? u.lastName  ?? "",
      email: u.email,
      role: u.role || "user",
    });
  } catch (e) {
    console.error("GET /auth/me error:", e);
    return res.status(500).json({ msg: "me_failed" });
  }
});

export default router;
