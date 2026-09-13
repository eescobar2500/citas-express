import { Router } from "express";

import { register, login, profile } from "../controllers/authController.js";

import auth from "../middleware/auth.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

// Públicas
router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

// Protegida: `auth` corre antes del controller y corta si el token falla
router.get("/profile", auth, asyncHandler(profile));

export default router;
