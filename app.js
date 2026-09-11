import "dotenv/config";
import express from "express";
import logger from "./middleware/logger.js";
import errorHandle from "./middleware/errorHandle.js";

import {
  findAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "./services/userService.js";

import {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
} from "./validations/userValidation.js";

const PORT = process.env.PORT || 3000;

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// ============================================================
// GET /users
// Obtener todos los usuarios
// ============================================================

app.get("/users", async (req, res, next) => {
  try {
    const users = await findAllUsers();

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// ============================================================
// GET /users/:id
// Obtener un usuario por ID
// ============================================================

app.get("/users/:id", async (req, res, next) => {
  const userId = Number(req.params.id);

  const idValidation = validateUserId(userId);

  if (!idValidation.valid) {
    return res.status(400).json({
      error: idValidation.error,
    });
  }

  try {
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ============================================================
// POST /users
// Crear un usuario
// ============================================================

app.post("/users", async (req, res, next) => {
  const newUser = req.body;

  const validation = validateCreateUser(newUser);

  if (!validation.valid) {
    return res.status(400).json({
      error: validation.error,
    });
  }

  try {
    const userExists = await findUserByEmail(newUser.email);

    if (userExists) {
      return res.status(409).json({
        error: "El usuario ya existe",
      });
    }

    const user = await createUser(newUser);

    res.status(201).json({
      message: "Usuario creado correctamente",
      user,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// PUT /users/:id
// Actualizar un usuario
// ============================================================

app.put("/users/:id", async (req, res, next) => {
  const userId = Number(req.params.id);

  const idValidation = validateUserId(userId);

  if (!idValidation.valid) {
    return res.status(400).json({
      error: idValidation.error,
    });
  }

  const validation = validateUpdateUser(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      error: validation.error,
    });
  }

  try {
    const existingUser = await findUserById(userId);

    if (!existingUser) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    const user = await updateUser(userId, req.body);

    res.json({
      message: "Usuario actualizado correctamente",
      user,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// DELETE /users/:id
// Eliminar un usuario
// ============================================================

app.delete("/users/:id", async (req, res, next) => {
  const userId = Number(req.params.id);

  const idValidation = validateUserId(userId);

  if (!idValidation.valid) {
    return res.status(400).json({
      error: idValidation.error,
    });
  }

  try {
    const existingUser = await findUserById(userId);

    if (!existingUser) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    const deletedUser = await deleteUser(userId);

    res.json({
      message: "Usuario eliminado correctamente",
      user: deletedUser,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/error", (req, res, next) => {
  next(new Error("Error intencional"));
});

// Middleware de errores
app.use(errorHandle);

// ============================================================
// SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
