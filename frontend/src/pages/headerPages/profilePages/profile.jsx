
import {  NavLink, Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className="profile-container">
      <h1 className="profile-title">Mi Perfil</h1>

      {/* Navegación tipo tabs */}
      <nav className="profile-tabs">
        <NavLink 
          to="info" 
          className={({ isActive }) => 
            `tab-link ${isActive ? "active-tab" : ""}`
          }
        >
          Información
        </NavLink>
        <NavLink 
          to="edit" 
          className={({ isActive }) => 
            `tab-link ${isActive ? "active-tab" : ""}`
          }
        >
          Editar Perfil
        </NavLink>
        <NavLink 
          to="delete" 
          className={({ isActive }) => 
            `tab-link ${isActive ? "active-tab" : ""}`
          }
        >
          Eliminar Cuenta
        </NavLink>
      </nav>

      {/* Contenido de la subruta activa */}
      <div className="profile-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;