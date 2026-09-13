import { Router } from "express";

import {
  getTimeBlocks,
  postTimeBlock,
  getReservations,
} from "../controllers/adminController.js";

import auth from "../middleware/auth.js";
import requireRole from "../middleware/requireRole.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

// Todas las rutas de admin exigen token válido y rol ADMIN.
// Al aplicarlo con router.use() no hay riesgo de olvidarlo en una ruta nueva.
router.use(auth, requireRole("ADMIN"));

router.get("/time-blocks", asyncHandler(getTimeBlocks));
router.post("/time-blocks", asyncHandler(postTimeBlock));
router.get("/reservations", asyncHandler(getReservations));

export default router;
