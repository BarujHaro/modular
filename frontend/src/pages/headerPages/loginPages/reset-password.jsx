import React,{useState} from 'react';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const localUrl = "http://localhost:5000";
const currentUrl = localUrl;

function ResetPassword(){
    const [mensaje, setMensaje] = useState("");
    const [pass, setPass] = useState("");
    const [passC, setPassC] = useState("");
     const navigate = useNavigate();
     const { token } = useParams();

    const validatePass = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;
        if (!pass.match(passwordRegex)) {
            return false;
        }
    };

  const ResetPass = async (e) => {
    setMensaje("");
    e.preventDefault();
    if(!validatePass){
        setMensaje("Tiene que tener extension de 8 caracteres, 1 mayuscula, 1 caracter especial y 1 numero");
        return;
    }

    if(pass!==passC){
        setMensaje("Las credenciales son diferentes");
        return;
    }


    try{
        await axios.post(`${currentUrl}/auth/reset-password/${token}` , {
            password: pass
        });
            setMensaje("Contraseña actualizada correctamente");
            // Redirigir después de 3 segundos
            setTimeout(() => navigate("/login"), 3000);
    }catch(error){
        console.log(error);
        setMensaje("Error en el cambio de contraseña");
    }
  };
      
          return (
              <div className='login-contenido'>
                <div className='login-formulario'>
<h2>Resetear contraseña</h2>
                  <form onSubmit={ResetPass}>
                        <div className='login-field'>
                            <label className='login-label'>Contraseña</label>
                            <div className='control'>
                                <input
                                type="password"  
                                className='login-input'
                                value={pass}
                                onChange={(e)=>setPass(e.target.value)}
            
                                required
                                />
                            </div>
                        </div>

                        <div className='login-field'>
                            <label className='login-label'>Confirma contraseña</label>
                            <div className='control'>
                                <input
                                type="password"  
                                className='login-input'
                                value={passC}
                                onChange={(e)=>setPassC(e.target.value)}
            
                                required
                                />
                            </div>
                        </div>

                        <div className='login-field'>
                            <button 
                                type="submit" 
                                className='login-boton'
                                
                            >
                            Cambiar
                            </button>
                        </div>


                  </form>
                 {mensaje && 
  <p className="login-message">{mensaje}</p>
}
                </div>
                  
              </div>
          );
      }
      
export default ResetPassword;