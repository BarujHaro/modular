import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import User from '../models/UserModel.js';
import dotenv from 'dotenv';
dotenv.config();


export const createAdminUser = async () => {
  //const adminEmail = 'admin@gmail.com';
 const adminEmail = process.env.ADMIN_NAME;
  // Verificar si ya existe
  const existingAdmin = await User.findOne({ where: { role: 'admin'  } });
  if (existingAdmin) {
    console.log('Admin ya existe.');
    return;
  }

  // Crear contraseña segura
  const salt = await bcrypt.genSalt(10);
  //const hashedPassword = await bcrypt.hash('admin123', salt);
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, salt);
  const verificationToken = uuidv4();
  // Crear el usuario admin
  await User.create({
    firstName: process.env.ADMIN_FN,
    lastName: process.env.ADMIN_LN,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    status: true,
    emailVerified: true,
    emailToken: verificationToken,
  });

  console.log('Usuario admin creado.');
};