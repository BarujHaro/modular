
import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import { createAdminUser } from "./config/adminSeeder.js";
import { setupAssociations, syncModels } from "./models/index.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Establecer relaciones
    setupAssociations();
    
    // 2. Sincronizar modelos
    await syncModels();
    
    // 3. Crear admin si no existe
    await createAdminUser();

    // 4. Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();