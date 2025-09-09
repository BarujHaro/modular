// backend/routes/CatalogRoute.js
import { Router } from "express";

const router = Router();

/* Utilidad para generar slugs consistentes */
function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");
}

/* ====== Catálogo de respaldo (fallback) ====== */
const FALLBACK_TAGS = [
  "Excel Básico","Google Sheets","Finanzas Personales","Presupuestos","Ahorro",
  "Análisis Financiero","Contabilidad Básica","Deuda y Crédito","Indicadores Económicos",
  "Razón Corriente","Prueba Ácida","Liquidez Inmediata","Capital de Trabajo",
  "Índice de Solvencia","Deuda Total / Activos","Deuda / Capital","Apalancamiento Financiero","Cobertura de Intereses",
  "Rotación de Inventarios","Rotación de Cuentas por Cobrar","Periodo Medio de Cobro","Rotación de Cuentas por Pagar",
  "Periodo Medio de Pago","Rotación de Activos Totales","Ciclo de Conversión de Efectivo",
  "Margen Bruto","Margen Operativo","Margen Neto","ROA","ROE","Margen EBITDA","ROIC"
].map((name, i) => ({ id: i + 1, name, slug: slugify(name) }));

const FALLBACK_ROADMAPS = [
  {
    title: "Finanzas Personales",
    tags: ["Presupuestos","Ahorro","Deuda y Crédito","Excel Básico","Google Sheets"]
  },
  {
    title: "Aprendiendo a llevar presupuestos",
    tags: ["Presupuestos","Excel Básico","Google Sheets","Flujo de Caja"]
  },
  {
    title: "Finanzas para Micronegocios",
    tags: ["Finanzas Personales","Flujo de Caja","Indicadores Económicos","Contabilidad Básica"]
  },
  {
    title: "Excel para Finanzas",
    tags: ["Excel Básico","Análisis Financiero","Margen Neto","ROE","ROA"]
  },
  {
    title: "Google Sheets para Negocios",
    tags: ["Google Sheets","Presupuestos","Finanzas Personales","Flujo de Caja"]
  },
  {
    title: "Razones de Liquidez y Solvencia",
    tags: ["Razón Corriente","Prueba Ácida","Liquidez Inmediata","Índice de Solvencia","Capital de Trabajo"]
  },
  {
    title: "Razones de Endeudamiento",
    tags: ["Deuda Total / Activos","Deuda / Capital","Apalancamiento Financiero","Cobertura de Intereses"]
  },
  {
    title: "Razones de Actividad / Productividad",
    tags: [
      "Rotación de Inventarios","Rotación de Cuentas por Cobrar","Periodo Medio de Cobro",
      "Rotación de Cuentas por Pagar","Periodo Medio de Pago","Rotación de Activos Totales",
      "Ciclo de Conversión de Efectivo"
    ]
  },
  {
    title: "Razones de Rentabilidad / Resultado",
    tags: ["Margen Bruto","Margen Operativo","Margen Neto","ROA","ROE","Margen EBITDA","ROIC"]
  }
].map((r, i) => ({
  id: 100 + i,
  title: r.title,
  slug: slugify(r.title),
  position: i,
  tags: r.tags.map((t) => {
    const tag = FALLBACK_TAGS.find(x => x.name === t) || { id: 0, name: t, slug: slugify(t) };
    return { id: tag.id || (1000 + Math.random()*1000|0), name: tag.name, slug: tag.slug, position: 0 };
  }),
}));

/* ====== Intento de carga desde DB (si hay modelos) ====== */
async function tryLoadFromDB() {
  // Cargamos dinámicamente los models; si falla, devolvemos null para usar fallback
  let models;
  try {
    // Muchas bases exportan "default" con los modelos; otras exportan named.
    const mod = await import("../models/index.js");
    models = mod?.default || mod; // soporte a ambos formatos
  } catch {
    return null;
  }

  // Intentamos ubicar modelos con distintos nombres comunes
  const Category   = models.Category   || models.categories   || models.CategoryModel;
  const Roadmap    = models.Roadmap    || models.roadmaps     || models.RoadmapModel;
  const RoadmapTag = models.RoadmapTag || models.roadmap_tags || models.RoadmapTagModel;

  if (!Category && !Roadmap) {
    return null;
  }

  // Cargar TAGS
  const tags = [];
  try {
    if (Category?.findAll) {
      const rows = await Category.findAll({ order: [["name","ASC"]] });
      for (const row of rows) {
        const name = row.name || row.dataValues?.name;
        const id   = row.id   || row.dataValues?.id;
        tags.push({ id, name, slug: row.slug || slugify(name) });
      }
    }
  } catch {
    // si falla, no es crítico: usaremos fallback luego
  }

  // Cargar ROADMAPS (+ sus tags si existe asociación)
  const roadmaps = [];
  try {
    if (Roadmap?.findAll) {
      let rows;

      // Intento 1: si existe asociación Roadmap <-> Category con alias 'tags'
      try {
        rows = await Roadmap.findAll({
          include: Category ? [{
            model: Category,
            as: "tags",
            through: { attributes: [] }
          }] : [],
          order: [
            ["position","ASC"],
            [{ model: Category, as: "tags" }, "name", "ASC"]
          ]
        });
      } catch {
        // Intento 2: sin include (luego resolvemos manualmente)
        rows = await Roadmap.findAll({ order: [["position","ASC"], ["title","ASC"]] });
      }

      for (const r of rows) {
        const id    = r.id || r.dataValues?.id;
        const title = r.title || r.dataValues?.title;
        const slug  = r.slug || slugify(title);
        let rmtags  = [];

        // Si el include funcionó y hay r.tags
        if (r.tags && Array.isArray(r.tags)) {
          rmtags = r.tags.map(t => ({
            id: t.id,
            name: t.name,
            slug: t.slug || slugify(t.name),
            position: t.position || 0
          }));
        } else if (RoadmapTag && Category) {
          // Si no hubo include, pero existen tablas pivote, resolvemos manual
          try {
            const links = await RoadmapTag.findAll({ where: { roadmap_id: id } });
            const idSet = new Set(links.map(l => l.category_id));
            const all   = await Category.findAll({ where: { id: Array.from(idSet) } });
            rmtags = all.map(t => ({
              id: t.id,
              name: t.name,
              slug: t.slug || slugify(t.name),
              position: 0
            }));
          } catch {
            // ignoramos si falla; quedará vacío
          }
        }

        roadmaps.push({ id, title, slug, position: r.position || 0, tags: rmtags });
      }
    }
  } catch {
    // ignoramos, usaremos fallback si no hay nada
  }

  return {
    tags: tags.length ? tags : null,
    roadmaps: roadmaps.length ? roadmaps : null,
  };
}

/* ====== Rutas ====== */

// Salud (opcional, útil para debug)
router.get("/health", (req, res) => {
  res.json({ ok: true, route: "/api/catalog" });
});

// TAGS
router.get("/tags", async (req, res) => {
  try {
    const db = await tryLoadFromDB();
    if (db?.tags?.length) {
      return res.json(db.tags);
    }
    // Fallback
    return res.json(FALLBACK_TAGS);
  } catch (err) {
    console.error("GET /catalog/tags error:", err);
    return res.status(500).json({ error: "catalog_tags_failed" });
  }
});

// ROADMAPS
router.get("/roadmaps", async (req, res) => {
  try {
    const db = await tryLoadFromDB();
    if (db?.roadmaps?.length) {
      // Garantizamos slugs para los tags del roadmap, por si no vienen
      const normalized = db.roadmaps.map(r => ({
        ...r,
        slug: r.slug || slugify(r.title),
        tags: (r.tags || []).map(t => ({ ...t, slug: t.slug || slugify(t.name) }))
      }));
      return res.json(normalized);
    }
    // Fallback
    return res.json(FALLBACK_ROADMAPS);
  } catch (err) {
    console.error("GET /catalog/roadmaps error:", err);
    return res.status(500).json({ error: "catalog_roadmaps_failed" });
  }
});

export default router;
