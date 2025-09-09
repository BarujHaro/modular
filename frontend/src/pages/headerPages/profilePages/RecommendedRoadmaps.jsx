// src/pages/headerPages/profilePages/RecommendedRoadmaps.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./recommended-roadmaps.css";
import { AuthContext } from "../../../components/AuthContext.jsx";
import { getLikes } from "../../../utils/userPrefs";
import { ROADMAPS } from "../roadmaps.jsx";

const THRESHOLD = 0.40; // 40%

function computeRecommendations(likesObj) {
  const tagLikes = likesObj?.tags || {};
  const recos = ROADMAPS.map(rm => {
    const total = rm.tags.length || 1;
    const liked = rm.tags.filter(t => !!tagLikes[t]).length;
    const ratio = liked / total;
    return { ...rm, liked, total, ratio, percent: Math.round(ratio * 100) };
  }).filter(r => r.ratio >= THRESHOLD);

  // Order by highest ratio then by title
  recos.sort((a, b) => (b.ratio - a.ratio) || a.title.localeCompare(b.title));
  return recos;
}

export default function RecommendedRoadmaps() {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(() => getLikes(user));

  // Recompute when user changes (login/logout)
  useEffect(() => {
    setLikes(getLikes(user));
  }, [user]);

  // Optional: re-check when returning from other routes (simple focus event)
  useEffect(() => {
    const onFocus = () => setLikes(getLikes(user));
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [user]);

  const recommendations = useMemo(() => computeRecommendations(likes), [likes]);

  return (
    <section className="recommended-roadmaps">
      <h2>Recomendaciones de Roadmaps</h2>
      {recommendations.length === 0 ? (
        <p className="muted">Aún no hay recomendaciones. Dale “me gusta” a los tags que te interesen y volveremos a sugerir.</p>
      ) : (
        <div className="reco-list">
          {recommendations.map((rm) => (
            <div key={rm.id} className="reco-card">
              <div className="reco-header">
                <h3 className="reco-title">{rm.title}</h3>
                <span className="reco-badge">{rm.percent}%</span>
              </div>
              <div className="reco-tags">
                {rm.tags.map((t) => (
                  <span
                    key={t}
                    className={`reco-tag ${likes.tags?.[t] ? "liked" : ""}`}
                    title={likes.tags?.[t] ? "Te gusta" : "Aún no marcado"}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="reco-actions">
                <Link to="/roadmaps" className="nav-link">Ver Roadmaps</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
