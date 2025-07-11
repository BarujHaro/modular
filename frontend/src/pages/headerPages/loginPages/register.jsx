import React,{useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import './style/login.css';
const localUrl = "http://localhost:5000";
const currentUrl = localUrl;

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailToken, setEmailToken] = useState("");
    const [verificationToken, setVerificationToken] = useState("");
    const [finalMessage, setFinalMessage] = useState("");
    const [tokenError, setTokenError] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const navigate = useNavigate();

    //1.5 valida los campos
    const validateForm = () => {
        
        const newErrors = {};
        //validacion de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.match(emailRegex)) {
            newErrors.email = "Ingresa un email válido";
        }

        // Validación de contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;
        if (!password.match(passwordRegex)) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial";
        }

        // Validación de campos requeridos
        if (!firstName.trim()) {
            newErrors.firstName = "El nombre es requerido";
        }
        if (!lastName.trim()) {
            newErrors.lastName = "Los apellidos son requeridos";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
     

    };

    //1. verifica el email y lo manda
    const VerifyEmail = async (e) => {
    
        e.preventDefault();
        if(!validateForm() || isSubmitting){
            return;
        }

        setIsSubmitting(true);  
      
        
        try{
          
            
            const response = await axios.post(`${currentUrl}/auth/register`, {
            firstName,
            lastName,
            email,
            password,
        });
 
        if(response.data && response.data.msg){
        setRegistrationSuccess(true);
        setEmailToken(response.data.token);
       
        
        }
               
        }catch(error){
            if(error.response?.data?.msg){
                setErrors({...errors, server: error.response.data.msg});

            }else{
                console.log(error);
            }
        }finally {
            setIsSubmitting(false);
        }


    };

    //3. verifica que haya puesto bien el token
    const verifyToken = async () => {
       
         try{
            if(emailToken.slice(0, 5) === verificationToken){
                setTokenError(false);
                await SaveUser();
            }else{
                setTokenError(true);
                
            }
         }catch(error){
        //error al verificar el token
        setTokenError(true);
         }
    };
   


    //4. Guardar al usuario
  const SaveUser = async () => {
    
    try {
        await axios.post(`${currentUrl}/users`, {
            firstName,
            lastName,
            email,
            password,
            emailToken,
        });
        //se guarda correctamente y despues de 5 segundos se redirige al login
        setFinalMessage("Cuenta verificada con éxito. Redirigiendo al login en 5 segundos...");
        setTimeout(() => {
            navigate("/login");
        }, 5000);
    } catch (error) {
        console.log("Error al guardar usuario:", error);
    }
};




    return (
        <div className="login-contenido">
            <div className="login-formulario">
                <div className='login-field'>
                        <h2>Registro</h2>
                    </div>
                        {registrationSuccess ? (
                            <div className="login-message">
                                <p>¡Registro exitoso!</p>
                                <p>Hemos enviado un correo de verificación</p>
                                <p>Ingresa los caracteres para verificar la cuenta:</p>
                                
                                <input
                                    type="text"
                                    maxLength={5}
                                    className="login-input"
                                    value={verificationToken}
                                    onChange={(e) => setVerificationToken(e.target.value)}
                                    required
                                />

                                <button className="login-boton" onClick={verifyToken}>
                                    Verificar cuenta
                                </button>

                                    {tokenError && (
                                        <p className="login-message">El código ingresado es incorrecto. Intenta de nuevo.</p>
                                    )}

                                    {finalMessage && (
                                        <div className="login-message">
                                            {finalMessage}
                                        </div>
                                        )}
                            </div>
                    ) : (
                    <form onSubmit={VerifyEmail}>
                            {errors.server && (
                        <div className="login-message">
                            {errors.server}
                        </div>
                        )}
                        {errors.email && (
                        <div className="login-message">
                            <p>{errors.email}</p>
                        </div>    
                        )}
            
                        {errors.password && (
                            <div className="login-message">
                                <p>{errors.password}</p>
                            </div>
                        )}

                        <div className='login-field'>
                            <label className='login-label'>Nombre</label>
                            <div className='control'>
                                <input
                                type="text"
                                className='login-input'
                                value={firstName}
                                onChange={(e)=>setFirstName(e.target.value)}
                                placeholder="Nombre"
                                required
                                />
                            </div>
                        </div>

                        <div className='login-field'>
                            <label className='login-label'>Apellidos</label>
                            <div className='control'>
                                <input
                                type="text"
                                className='login-input'
                                value={lastName}
                                onChange={(e)=>setLastName(e.target.value)}
                                placeholder="Apellidos"
                                required
                                />
                            </div>
                        </div>

                        <div className='login-field'>
                            <label className='login-label'>Email</label>
                            <div className='control'>
                                <input
                                type="text"
                                className='login-input'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="Email@gmail.com"
                                required
                                />
                            </div>
                        </div>                    

                        <div className='login-field'>
                            <label className='login-label'>Contraseña</label>
                            <div className='control'>
                                <input
                                type="password"  
                                className='login-input'
                                value={password}
                                onChange={(e)=>setPass(e.target.value)}
                                placeholder="Pass"
                                required
                                />
                            </div>
                        </div>

                        <div className='login-field'>
                            <button 
                                type="submit" 
                                className='login-boton'
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Registrando...' : 'Registrar'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Register;