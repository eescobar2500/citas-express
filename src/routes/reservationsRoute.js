import { Router } from "express";

import {
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
} from "../controllers/reservationsController.js";

import auth from "../middleware/auth.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

// Protegida: `auth` corre antes del controller y corta si el token falla
router.post("/", auth, asyncHandler(createReservation));
// La lista va antes que "/:id" para que Express no matchee "/" contra el param
router.get("/", auth, asyncHandler(getReservations));
router.get("/:id", auth, asyncHandler(getReservation));
router.put("/:id", auth, asyncHandler(updateReservation));

export default router;
