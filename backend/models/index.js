import { Sequelize } from "sequelize";
import db from "../config/database.js";

// Importa los modelos como están actualmente (sin cambiar su estructura)
import User from "./UserModel.js";
import Resource from "./ResourceModel.js";
import Category from "./CategoryModel.js";
import ResourceCategory from "./ResourceCategoryModel.js";
import Rating from "./RatingModel.js";
import Favorite from "./FavoriteModel.js";

// Espera a que los modelos se carguen antes de asociarlos
const setupAssociations = () => {
  // Verifica que los modelos estén definidos
  if (User && Resource) {
    User.associate?.({ Resource, Rating, Favorite, Category });
    Resource.associate?.({ User, Rating, Favorite, Category, ResourceCategory });
    Category.associate?.({ Resource, ResourceCategory });
  }
};
//Sincronizacion del modelo
const syncModels = async () => {

  try {
    await db.sync({ alter: true }); //crea tablas si no existen y modifica las columnas si hay cambios en el modelo
    console.log("-------Modelos sincronizados");
  } catch (error) {
    console.error("-----Error al sincronizar modelos:", error);
    throw error;
  }
};
//Se exporta todo
export { 
  User,
  Resource,
  Category,
  ResourceCategory,
  Rating,
  Favorite,
  setupAssociations,
  syncModels
};