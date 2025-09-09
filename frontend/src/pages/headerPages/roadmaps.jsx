// src/pages/headerPages/roadmaps.jsx
import React, { useEffect, useState, useContext } from "react";
import "./roadmaps.css";
import { AuthContext } from "../../components/AuthContext.jsx";
import { getLikes, toggleRoadmapLike } from "../../utils/userPrefs";

// 🚀 Roadmaps (incluye Razones Financieras)
export const ROADMAPS = [
  // --- EXISTENTES ---
  { id: "rm-excel", title: "Excel para Finanzas", tags: ["Excel Básico","Excel Avanzado","Macros VBA","Modelado Financiero"] },
  { id: "rm-sheets", title: "Google Sheets para Negocios", tags: ["Google Sheets","Presupuestos","Flujo de Caja","Ahorro"] },
  { id: "rm-powerbi", title: "Power BI Inicial", tags: ["Power BI","Análisis Financiero","Indicadores Económicos"] },
  { id: "rm-personal", title: "Finanzas Personales", tags: ["Finanzas Personales","Ahorro","Presupuestos"] },
  { id: "rm-presup", title: "Aprendiendo a llevar Presupuestos", tags: ["Presupuestos","Costos y Presupuestos","Flujo de Caja"] },
  { id: "rm-micro", title: "Finanzas para Micronegocios", tags: ["Finanzas para Micronegocios","Contabilidad Básica","Análisis de Estados Financieros"] },

  // --- NUEVOS: RAZONES FINANCIERAS ---
  {
    id: "rm-liquidez",
    title: "Razones de Liquidez / Solvencia",
    tags: [
      "Razón Corriente",
      "Prueba Ácida",
      "Liquidez Inmediata",
      "Capital de Trabajo",
      "Índice de Solvencia"
    ]
  },
  {
    id: "rm-endeudamiento",
    title: "Razones de Endeudamiento",
    tags: [
      "Deuda Total / Activos",
      "Deuda / Capital",
      "Apalancamiento Financiero",
      "Cobertura de Intereses",
      "Deuda LP / Capital"
    ]
  },
  {
    id: "rm-actividad",
    title: "Razones de Actividad / Productividad",
    tags: [
      "Rotación de Inventarios",
      "Rotación de Cuentas por Cobrar",
      "Periodo Medio de Cobro",
      "Rotación de Cuentas por Pagar",
      "Periodo Medio de Pago",
      "Rotación de Activos Totales",
      "Ciclo de Conversión de Efectivo"
    ]
  },
  {
    id: "rm-rentabilidad",
    title: "Razones de Rentabilidad / Resultado",
    tags: [
      "Margen Bruto",
      "Margen Operativo",
      "Margen Neto",
      "ROA",
      "ROE",
      "Margen EBITDA",
      "ROIC"
    ]
  }
];

export default function Roadmaps() {
  const { user } = useContext(AuthContext);

  // ✅ Likes en estado local para reacción inmediata
  const [likes, setLikes] = useState(() => getLikes(user));
  useEffect(() => {
    setLikes(getLikes(user));
  }, [user]);

  const [expanded, setExpanded] = useState({}); // roadmaps desplegados

  const isLiked = (rid) => !!likes?.roadmaps?.[rid];

  const handleToggleLike = (rid) => {
    const updated = toggleRoadmapLike(user, rid); // persiste en localStorage
    setLikes(updated); // refleja de inmediato
  };

  const toggleExpand = (rid) => {
    setExpanded((prev) => ({ ...prev, [rid]: !prev[rid] }));
  };

  return (
    <div className="roadmaps-page">
      <h1>Roadmaps</h1>

      <div className="roadmaps-list">
        {ROADMAPS.map((rm) => (
          <div key={rm.id} className="roadmap-item">
            <div className="roadmap-header">
              <button className="roadmap-pill" onClick={() => toggleExpand(rm.id)}>
                {rm.title}
              </button>
              <button
                className={`like-btn ${isLiked(rm.id) ? "liked" : ""}`}
                onClick={() => handleToggleLike(rm.id)}
                aria-label={isLiked(rm.id) ? "Quitar me gusta" : "Dar me gusta"}
                title={isLiked(rm.id) ? "Quitar me gusta" : "Dar me gusta"}
              >
                {isLiked(rm.id) ? "♥" : "♡"}
              </button>
            </div>

            {expanded[rm.id] && (
              <div className="roadmap-tags-container">
                {rm.tags.map((t) => (
                  <span key={t} className="roadmap-tag">{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="note">* Aquí solo ves los tags de cada roadmap. Para ver videos, vuelve al Home.</p>
    </div>
  );
}
