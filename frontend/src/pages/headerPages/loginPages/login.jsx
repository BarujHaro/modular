import  { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './style/login.css';
import { AuthContext } from "../../../components/AuthContext.jsx"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [errors, setErrors] = useState(false);
    const [mensaje, setMensaje] = useState(false);
    const navigate = useNavigate();

    const { login } = useContext(AuthContext); 

    const LoginEmail = async (e) => {
        e.preventDefault();
        try {
            setErrors(false);
            const res = await axios.post("http://localhost:5000/auth/login", {
                email,
                password,
            });

            login(res.data.user, res.data.token); 
            setMensaje("Login exitoso, redirigiendo a pagina principal");
            setTimeout(() => {
            navigate("/home");
        }, 2000);
        } catch (err) {
            console.log("Error de login", err.response?.data);
            setErrors(true);
        }
    };

    useEffect(() => {
  if (errors) {
    const timer = setTimeout(() => {
      setErrors(false);
    }, 3000); 

    return () => clearTimeout(timer); 
  }
}, [errors]);

    return (
        <div className="contenido">
            <div className="formulario">
                <div className='field'>
                    <h2>Login</h2>
                </div>
                
                <form onSubmit={LoginEmail}>


                        <div className='field'>
                            <label className='label'>Email</label>
                            <div className='control'>
                                <input
                                type="text"  
                                className='input'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="xxxxx@gmail.com"
                                required
                                />
                            </div>
                        </div>

                        <div className='field'>
                            <label className='label'>Contraseña</label>
                            <div className='control'>
                                <input
                                type="password"  
                                className='input'
                                value={password}
                                onChange={(e)=>setPass(e.target.value)}
                                placeholder="Pass"
                                required
                                />
                            </div>
                        </div>



                             <div className='field'>
                <button type="submit" className='boton'>
                    Iniciar sesión
                </button>
            </div>
                        

                        

                        

   
                </form>

                    <div >
                        <Link to="/forgot-password" className="forgot-link">
                            ¿Olvidaste la contraseña?
                        </Link>
                        </div>

                                             {errors && (
                        <p className="message">Credenciales Incorrectas</p>
                                    
                        )}
                        {mensaje && (
                        <p className="message">{mensaje}</p>
                        )}


<div className='field'>
    <button 
        className='boton'
        onClick={() => navigate('/register')}  
    >
        Registrarse
    </button>
</div>

            </div>

        </div>
        

    );
}
export default Login;