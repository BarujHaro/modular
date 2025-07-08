
import {  NavLink, Outlet } from "react-router-dom";

const Options = () => {
  return (
    <div className="options-container">
      <h1 className="options-title">Mi Perfil</h1>

      {/* Navegación tipo tabs */}
        <nav className="options-tabs">
            <NavLink 
            to="info" 
            className={({ isActive }) => 
                `tab-link ${isActive ? "active-tab" : ""}`
            }
            >
            Usuarios
            </NavLink>
            <NavLink 
            to="edit" 
            className={({ isActive }) => 
                `tab-link ${isActive ? "active-tab" : ""}`
            }
            >
            Recursos
            </NavLink>
        
        
        </nav>

      {/* Contenido de la subruta activa */}
      <div className="options-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Options;