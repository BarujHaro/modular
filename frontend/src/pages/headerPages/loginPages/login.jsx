import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./style/login.css"; // Mantén tu hoja; abajo agregamos estilos nuevos
import { AuthContext } from "../../../components/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [errors, setErrors] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");


  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setMensaje(null);
    /*if((email === "admin" || email === "admin@admin.com")&& password === "admin"){
      login({email,role:"admin",name:"admin"});
      navigate("/home");
      return;
    }*/

    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
      await login(data.user, data.token); // lógica del original
      setMensaje("Autenticación exitosa");
      navigate("/home");
    } catch (err) {
      const msg = err?.response?.data?.message || "Error al iniciar sesión. Intenta de nuevo.";
      setErrors(msg);
    }
  };

  return (
    <div className="login-page theme-dark">
      <div className="login-card">
        <div className="login-header">
          <h2>Iniciar sesión</h2>
          <p className="sub">Accede a tu cuenta para continuar</p>
        </div>

        {errors && <div className="alert error">{errors}</div>}
        {mensaje && <div className="alert ok">{mensaje}</div>}

        <form onSubmit={onSubmit} className="login-form">
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@correo.com"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary full">
            Iniciar sesión
          </button>
        </form>

        <div className="login-footer">
          <span>¿No tienes cuenta?</span>
          <button type="button" className="btn-link" onClick={() => navigate("/register")}>
            Regístrate
          </button>
          {/* <Link to="/register" className="btn-link">Regístrate</Link> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
