import {useState} from 'react';
import axios from "axios";
import './style/login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");

    const localUrl = "http://localhost:5000";
    const currentUrl = localUrl;

  const SendMail = async (e) => {
    e.preventDefault();
            if(!email){
            return;
        }
        
    try{

        await axios.post(`${currentUrl}/auth/forgotPassword`, {
            email: email
        });
        setMensaje("El correo se ha enviado con exito");
    }catch(error){
            console.error("Error completo:", error);
            setMensaje("Error al enviar correo");
    
    }
  };
      
          return (
              <div className="login-contenido">
                  

<div className='login-formulario'>
    <h2>Recuperación de contraseña</h2>
<form onSubmit={SendMail}>
                        <div className='login-field'>
                            <label className='login-label'>Email</label>
                            <div className='control'>
                                <input
                                type="text"  
                                className='login-input'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="xxxxxx@gmail.com"
                                required
                                />
                            </div>
                        </div>


                        <div className='login-field'>
                            <button 
                                type="submit" 
                                className='login-boton'
                                
                            >
                            Recuperar
                            </button>
                        </div>


                  </form>

                  {mensaje && (
                    <div className='login-message'>
                                            {mensaje}
                                        </div>
                  )}

</div>

                  

              </div>
          );
      }
      
export default ForgotPassword;