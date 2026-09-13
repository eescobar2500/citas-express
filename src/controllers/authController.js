import {
  findUserByEmail,
  findUserByEmailWithPassword,
  registerUser,
  verifyPassword,
} from "../services/userService.js";

import { generateToken } from "../services/tokenService.js";

import {
  validateRegisterUser,
  validateLogin,
} from "../utils/validations/userValidation.js";

import ApiError from "../utils/ApiError.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const validation = validateRegisterUser({ name, email, password });

  if (!validation.valid) {
    throw ApiError.badRequest(validation.error);
  }

  const userExists = await findUserByEmail(email);

  if (userExists) {
    throw ApiError.conflict("El email ya está registrado");
  }

  // El rol nunca viene del cliente: siempre USER en el registro público
  const user = await registerUser({
    name,
    email,
    password,
    role: "USER",
  });

  res.status(201).json({
    message: "Usuario registrado correctamente",
    user,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const validation = validateLogin({ email, password });

  if (!validation.valid) {
    throw ApiError.badRequest(validation.error);
  }

  const user = await findUserByEmailWithPassword(email);

  // Mismo mensaje para email inexistente y password incorrecta:
  // distinguirlos revelaría qué emails están registrados.
  if (!user) {
    throw ApiError.unauthorized();
  }

  const passwordMatches = await verifyPassword(password, user.password);

  if (!passwordMatches) {
    throw ApiError.unauthorized();
  }

  const token = generateToken(user);

  res.json({
    message: "Login exitoso",
    token,
    // Se enumeran los campos porque `user` incluye el hash de la contraseña
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const profile = async (req, res) => {
  res.json({
    message: "Accediste a una ruta protegida",
    user: req.user,
  });
};
