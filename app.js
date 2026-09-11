import "dotenv/config";
import express from "express";
import { getUsers, saveUsers } from "./database/users.js";
import logger from "./middleware/logger.js";
import errorHandle from "./middleware/errorHandle.js";

import {
  validateCreateUser,
  validateUpdateUser,
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

app.get("/users", (req, res) => {
  getUsers((err, users) => {
    if (err) {
      return res.status(500).json({
        error: "Error con la conexión de datos",
      });
    }

    res.json(users);
  });
});

// ============================================================
// GET /users/:id
// Obtener un usuario por ID
// ============================================================

app.get("/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  getUsers((err, users) => {
    if (err) {
      return res.status(500).json({
        error: "Error con la conexión de datos",
      });
    }

    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    res.json(user);
  });
});

// ============================================================
// POST /users
// Crear un usuario
// ============================================================

app.post("/users", (req, res) => {
  const newUser = req.body;

  const validation = validateCreateUser(newUser);

  if (!validation.valid) {
    return res.status(400).json({
      error: validation.error,
    });
  }

  getUsers((err, users) => {
    if (err) {
      return res.status(500).json({
        error: "Error con la conexión de datos",
      });
    }

    const userExists = users.find((user) => user.id === newUser.id);

    if (userExists) {
      return res.status(409).json({
        error: "El usuario ya existe",
      });
    }

    users.push(newUser);

    saveUsers(users, (err) => {
      if (err) {
        return res.status(500).json({
          error: "Error al guardar el usuario",
        });
      }

      res.status(201).json({
        message: "Usuario creado correctamente",
        user: newUser,
      });
    });
  });
});

// ============================================================
// PUT /users/:id
// Actualizar un usuario
// ============================================================

app.put("/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  const updatedUser = {
    id: userId,
    ...req.body,
  };

  const validation = validateUpdateUser(updatedUser);

  if (!validation.valid) {
    return res.status(400).json({
      error: validation.error,
    });
  }

  getUsers((err, users) => {
    if (err) {
      return res.status(500).json({
        error: "Error con la conexión de datos",
      });
    }

    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    users[userIndex] = updatedUser;

    saveUsers(users, (err) => {
      if (err) {
        return res.status(500).json({
          error: "Error al actualizar el usuario",
        });
      }

      res.json({
        message: "Usuario actualizado correctamente",
        user: updatedUser,
      });
    });
  });
});

// ============================================================
// DELETE /users/:id
// Eliminar un usuario
// ============================================================

app.delete("/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  getUsers((err, users) => {
    if (err) {
      return res.status(500).json({
        error: "Error con la conexión de datos",
      });
    }

    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    // Eliminar usuariov y devuelve el que elimino para mostrarlo al usuario.
    const deletedUser = users.splice(userIndex, 1)[0];

    saveUsers(users, (err) => {
      if (err) {
        return res.status(500).json({
          error: "Error al eliminar el usuario",
        });
      }

      res.json({
        message: "Usuario eliminado correctamente",
        user: deletedUser,
      });
    });
  });
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
