// frontend/src/pages/headerPages/home.jsx
import React, { useState, useContext, useMemo,useEffect, useRef } from "react";
import "./home.mod.css";
import TagsContainer from "../../components/TagsContainer";
import VideosContainer from "../../components/VideosContainer";
import { AuthContext } from "../../components/AuthContext.jsx";
import { getLikes, setLikes, toggleTagLike, getUserKey } from "../../utils/userPrefs";
import { ROADMAPS } from "./roadmaps.jsx";

import { getTags } from "../../services/catalog";
import { likeTag, unlikeTag, getMyLikedTagIds } from "../../services/likes";

function Home() {
  const { user } = useContext(AuthContext);
  const isLogged = !!user;

  // ==== Sección 1 (Tags + Videos) ====
  const [selectedTag, setSelectedTag] = useState(null);
  // Estado base: si está logueado, trae likes persistidos; si no, objeto vacío
  const [likedTags, setLikedTags] = useState(() => (isLogged ? (getLikes(user).tags || {}) : {}));
  const handleTagSelect = (tag) => setSelectedTag(tag);

  //cache de tags backend para mapear por nombre ===
  const nameToIdRef = useRef(new Map()); // name -> id
  const idToNameRef = useRef(new Map()); // id -> name

  useEffect(() => {
    // Cargar catálogo solo una vez
    (async () => {
      try {
        const list = await getTags(); // [{id, name}]
        const n2i = new Map();
        const i2n = new Map();
        list.forEach(t => { n2i.set(t.name, Number(t.id)); i2n.set(Number(t.id), t.name); });
        nameToIdRef.current = n2i;
        idToNameRef.current = i2n;
      } catch (e) {
        console.error("No se pudo cargar el catálogo de tags (se mantiene UI):", e);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (!isLogged) return;
      try {
        const ids = await getMyLikedTagIds(); // Set<number>
        if (ids.size === 0) return;
        const next = { ...getLikes(user).tags }; // conserva lo local que ya usas
        ids.forEach(id => {
          const name = idToNameRef.current.get(Number(id));
          if (name) next[name] = true;
        });
        setLikes(user, { tags: next, roadmaps: getLikes(user).roadmaps || {} });
        setLikedTags({ ...next });
      } catch (e) {
        console.warn("No se pudieron sincronizar likes desde backend (UI sigue igual):", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged, user]);
  const handleLikeToggle = async (tag) => {
    if (isLogged) {
      // Mantén TU comportamiento actual (persistencia por usuario)…
      const likes = toggleTagLike(user, tag); // persiste por usuario (local)
      setLikedTags({ ...(likes.tags || {}) });

      //intenta reflejarlo en backend sin romper UI
      const tagId = nameToIdRef.current.get(tag);
      if (!tagId) return; // si backend no conoce ese tag, no rompemos nada

      try {
        if (likes.tags?.[tag]) {
          await likeTag(tagId);
        } else {
          await unlikeTag(tagId);
        }
      } catch (e) {
        console.error("Backend like error (UI intacta):", e);
      }
    } else {
      // visitante: solo en memoria (tu lógica original)
      setLikedTags((prev) => ({ ...prev, [tag]: !prev[tag] }));
    }
  };
  // ==== Sección 2 (ROADMAPS solo si está logueado) ====
  const likesAll = useMemo(() => getLikes(user), [user]);
  const likedRoadmaps = useMemo(
    () => (likesAll.roadmaps ? (Object.entries(likesAll.roadmaps).filter(([_, v]) => !!v).map(([k]) => k)) : []),
    [likesAll]
  );
  // Selección de tag por roadmap para mostrar videos
  const [selectedByRoadmap, setSelectedByRoadmap] = useState({});
  const pickRoadmapTag = (rid, tag) => setSelectedByRoadmap((prev) => ({ ...prev, [rid]: tag }));
  

  return (
    <div className="home">
      {/* === BLOQUES SUPERIORES de TEXTO ===
          - Visitante (no logueado): se muestran los 2 contenedores de texto (como en el diseño público).
          - Logueado: se OCULTAN esos 2 contenedores (solo se muestra la CTA final más abajo).
      */}
      {!isLogged && (
        <div className="text-containers-wrapper">
          <div className="text-container">
            <textarea
              readOnly
              defaultValue={`Amplía tu conocimiento en finanzas personales e inversiones. 
Haz click en los TAGS que tenemos para ti y adéntrate en el mundo financiero. Descubre herramientas y adquiere conocimientos para mejorar la administración de tu dinero o el de tu negocio.`}
            />
          </div>
          <div className="text-container">
            <textarea
              readOnly
              defaultValue={`Para una experiencia más personalizada, inicia sesión y crea tu perfil. Así podremos recomendarte los TAGS que mejor te ayuden en tu camino de aprendizaje.
¡Haz click en Log-In y regístrate ahora!`}
            />
          </div>
        </div>
      )}

      {/* === Sección principal: Tags (izq) + Videos (der) ===
          - Si está logueado, el contenedor de Tags muestra por DEFECTO solo los liked (puede buscar más).
      */}
      <div className="main-content-area">
        <TagsContainer
          onTagSelect={handleTagSelect}
          likedTags={likedTags}
          onLikeToggle={handleLikeToggle}
          showOnlyLiked={isLogged}   // modo “solo liked” por defecto cuando hay sesión
        />
        <VideosContainer selectedTag={selectedTag} />
      </div>

      {/* === ROADMAPS (solo logueado) === */}
      {isLogged && (
        <section className="roadmaps-section">
          <h2>ROADMAPS</h2>
          {likedRoadmaps.length === 0 ? (
            <p className="muted">Dale “me gusta” a uno en la sección Roadmaps para verlo aquí.</p>
          ) : (
            likedRoadmaps.map((rid) => {
              // Encontramos el roadmap por id importando desde roadmaps.jsx
              const rm = (typeof window !== "undefined" && window.__ROADMAPS_CACHE__)
                ? window.__ROADMAPS_CACHE__.find(r => r.id === rid)
                : null;
              // Si no hay cache global, importamos estaticamente desde ROADMAPS
              // (este import se resuelve por el bundler; arriba ya importamos ROADMAPS)
              const roadmap = rm || (ROADMAPS.find(r => r.id === rid) || null);

              if (!roadmap) return null;
              return (
                <div key={roadmap.id} className="roadmap-block">
                  <div className="roadmap-block-title">{roadmap.title}</div>
                  <div className="roadmap-block-grid">
                    <div className="roadmap-tags-only">
                      {roadmap.tags.map((t) => (
                        <button
                          key={t}
                          className="roadmap-tag-btn"
                          onClick={() => pickRoadmapTag(roadmap.id, t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="roadmap-videos">
                      {selectedByRoadmap[roadmap.id] ? (
                        <VideosContainer selectedTag={selectedByRoadmap[roadmap.id]} />
                      ) : (
                        <p className="muted small">Selecciona un tag del roadmap para ver videos.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      )}

      {/* === CTA FINAL (misma para ambos casos) === */}
      <section className="call-to-action-section">
        <h2>
          ¿Tu negocio va <span className="text-green">verde</span>,
          <span className="text-yellow">amarillo</span>,
          <span className="text-red">rojo</span>?
        </h2>
        <p>Convierte tus números en acciones concretas</p>
        <p>Detecta riesgos antes de que afecten tu caja</p>
        <div className="cta-register-box">
          <p>
            REGÍSTRATE O SI YA TIENES CUENTA INICIA SESIÓN Y HAZ CLICK EN "MI NEGOCIO",
            RELLENA EL FORMULARIO Y TOMA DECISIONES HOY CON TU SEMÁFORO PYME.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
