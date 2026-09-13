import {
  findAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService.js";

import {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
} from "../utils/validations/userValidation.js";

import ApiError from "../utils/ApiError.js";

export const getUsers = async (req, res) => {
  const users = await findAllUsers();

  res.json(users);
};

export const getUserById = async (req, res) => {
  const userId = Number(req.params.id);

  const idValidation = validateUserId(userId);

  if (!idValidation.valid) {
    throw ApiError.badRequest(idValidation.error);
  }

  const user = await findUserById(userId);

  if (!user) {
    throw ApiError.notFound("Usuario no encontrado");
  }

  res.json(user);
};

export const postUser = async (req, res) => {
  const newUser = req.body;

  const validation = validateCreateUser(newUser);

  if (!validation.valid) {
    throw ApiError.badRequest(validation.error);
  }

  const userExists = await findUserByEmail(newUser.email);

  if (userExists) {
    throw ApiError.conflict("El usuario ya existe");
  }

  const user = await createUser(newUser);

  res.status(201).json({
    message: "Usuario creado correctamente",
    user,
  });
};

export const putUser = async (req, res) => {
  const userId = Number(req.params.id);

  const idValidation = validateUserId(userId);

  if (!idValidation.valid) {
    throw ApiError.badRequest(idValidation.error);
  }

  const validation = validateUpdateUser(req.body);

  if (!validation.valid) {
    throw ApiError.badRequest(validation.error);
  }

  const existingUser = await findUserById(userId);

  if (!existingUser) {
    throw ApiError.notFound("Usuario no encontrado");
  }

  const user = await updateUser(userId, req.body);

  res.json({
    message: "Usuario actualizado correctamente",
    user,
  });
};

export const removeUser = async (req, res) => {
  const userId = Number(req.params.id);

  const idValidation = validateUserId(userId);

  if (!idValidation.valid) {
    throw ApiError.badRequest(idValidation.error);
  }

  const existingUser = await findUserById(userId);

  if (!existingUser) {
    throw ApiError.notFound("Usuario no encontrado");
  }

  const deletedUser = await deleteUser(userId);

  res.json({
    message: "Usuario eliminado correctamente",
    user: deletedUser,
  });
};
