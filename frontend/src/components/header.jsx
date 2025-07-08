
import { useContext } from "react";

import { Link } from "react-router-dom";

import { AuthContext } from "../components/AuthContext.jsx";
import './header.css';

function Header() {
  const { user, token} = useContext(AuthContext);
  

    const isLoggedIn = !!token;
    const isAdmin = user?.role === "admin";

    return (
        <nav className="headerClass">   
          <Link to="/">Sparkup</Link>
          <Link to="/search">Busqueda</Link>
          <Link to="/idea">Idea</Link>
          <Link to="/upload">Subir</Link>
          {isLoggedIn?(
            <>
            <Link to="/profile">Perfil</Link>
            {isAdmin && <Link to="/options">Opciones</Link>}
            </>
          ):(
            <>
            <Link to="/login">Login</Link>
            </>
          )}
          

        </nav>
    );
}

export default Header;