import { Router } from "express";

import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";
import reservations from "./reservationsRoute.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/reservations", reservations);

export default router;
