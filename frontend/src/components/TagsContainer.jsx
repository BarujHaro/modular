import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './TagsContainer.css';

const financeTags = [
  "Excel Básico","Power BI","Contabilidad Básica","Análisis Financiero","Inversiones para Principiantes",
  "Bolsa de Valores","Criptomonedas","Finanzas Personales","Presupuestos","Ahorro",
  "Contabilidad Avanzada","Impuestos","Modelado Financiero","Excel Avanzado","Macros VBA",
  "Valoración de Empresas","Mercados de Capitales","Gestión de Riesgos","Trading","Análisis Técnico",
  "Finanzas Corporativas","Planificación de la Jubilación","Seguros","Deuda y Crédito","Historia Económica",
  "Econometría","Estadística para Finanzas","Python para Finanzas","R para Finanzas","Blockchain",
  "ETFs","Fondos Mutuos","Bienes Raíces","Crowdfunding","Fintech",
  "Regulación Financiera","Auditoría","Costos y Presupuestos","Flujo de Caja","Indicadores Económicos",
  "Banca de Inversión","Capital de Riesgo","Fusiones y Adquisiciones","Derivados Financieros","Options Trading",
  "Psicología del Inversor","Noticias Económicas","Análisis de Estados Financieros","Normas IFRS","Ratio Financiero",
  "Google Sheets","Finanzas para Micronegocios","Razón Corriente","Prueba Ácida","Liquidez Inmediata",
  "Capital de Trabajo","Índice de Solvencia","Deuda Total / Activos","Deuda / Capital","Apalancamiento Financiero","Cobertura de Intereses",
  "Deuda LP / Capital","Rotación de Inventarios","Rotación de Cuentas por Cobrar","Periodo Medio de Cobro","Rotación de Cuentas por Pagar",
  "Periodo Medio de Pago","Rotación de Activos Totales","Ciclo de Conversión de Efectivo",
  "Margen Bruto","Margen Operativo","Margen Neto","ROA","ROE","Margen EBITDA","ROIC"


];

const TagsContainer = ({ onTagSelect, likedTags = {}, onLikeToggle, showOnlyLiked = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const base = financeTags;
  const bySearch = base.filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  const byLike = showOnlyLiked && !searchTerm
    ? bySearch.filter(tag => likedTags[tag])
    : bySearch;

  const filteredTags = byLike;

  return (
    <div className="tags-main-container">
      <div className="search-tags-wrapper">
        <input
          type="text"
          placeholder="Buscar tag..."
          className="search-tags-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="tags-list">
        {filteredTags.map((tag) => (
          <div key={tag} className="tag-item">
            <button className="tag-button" onClick={() => onTagSelect && onTagSelect(tag)}>
              {tag}
            </button>
            <span className="like-icon" onClick={() => onLikeToggle && onLikeToggle(tag)}>
              {likedTags[tag] ? <FaHeart /> : <FaRegHeart /> }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsContainer;
