import { Router } from "express";

import {
  getUsers,
  getUserById,
  postUser,
  putUser,
  removeUser,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/", auth, asyncHandler(getUsers));
router.get("/:id", auth, asyncHandler(getUserById));
router.post("/", auth, asyncHandler(postUser));
router.put("/:id", auth, asyncHandler(putUser));
router.delete("/:id", auth, asyncHandler(removeUser));

export default router;
