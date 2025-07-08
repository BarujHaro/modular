// Importa nodemailer para enviar correos
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import SibApiV3Sdk from 'sib-api-v3-sdk';

// Permite obtener la ruta actual del archivo ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
 

// Configura la API key
const defaultClient = SibApiV3Sdk.ApiClient.instance;

defaultClient.defaultHeaders = {
  'api-key': process.env.BREVO_API_KEY,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

// Crea la instancia del servicio
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


// Función para enviar correo de verificación
export const sendVerificationEmail = async (email, token) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // Crear instancia correcta
        
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = 'Verifica tu cuenta';
    sendSmtpEmail.sender = { 
        name: 'SparkUp', 
        email: process.env.EMAIL_USER 
    };
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">¡Gracias por registrarte!</h2>
            <p>Por favor verifica tu cuenta registrando los caracteres:</p>
            <div style="background-color: #f3f4f6; border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; color: #111827; letter-spacing: 2px;">${token.slice(0, 5)}</span>
            </div>
            <p style="margin-top: 20px;">Si no solicitaste este registro, ignora este mensaje.</p>
        </div>
    `;

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Correo enviado correctamente', response);
        return response;
    } catch (error) {
        console.error('Error al enviar correo:', error.response?.body || error.message);
        throw error;
    }
};




export const SendForgotEmail = async (email, token) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    
    sendSmtpEmail.to = [{email}];
    sendSmtpEmail.subject = 'Restablecer contraseña';
    sendSmtpEmail.sender = {
        name: 'SparkUp', 
        email: process.env.EMAIL_USER 

    };
    sendSmtpEmail.htmlContent = `
         <div style="font-family: Arial, sans-serif;">
                <h2 style="color: #2563eb;">Recuperación de contraseña</h2>
                <p>Haz clic en el botón para restablecer tu contraseña:</p>
                <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
                    Restablecer contraseña
                </a>
                <p style="color: #ef4444; font-size: 14px;">
                    ⚠️ Este enlace expirará en 20 minutos.
                </p>

        <p style="margin-top: 20px;">Si no solicitaste este correo, ignora este mensaje.</p>
    </div>

`;


    try {
        
    await apiInstance.sendTransacEmail(sendSmtpEmail);
        return { success: true, message: 'Correo de recuperación enviado' };
    } catch (error) {
                console.error('Error al enviar correo de recuperación:', error);
        throw new Error('Error al enviar el correo de recuperación');
    }
};

