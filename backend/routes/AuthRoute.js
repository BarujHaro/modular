import express from "express";
import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} from "../controllers/AuthController.js";


const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/forgotPassword', forgotPassword);
router.post('/auth/reset-password/:token', resetPassword);




export default router;


