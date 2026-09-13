import bcrypt from "bcrypt";
import prisma from "../database/prisma.js";

const SALT_ROUNDS = 10;

// Campos que se devuelven al cliente (nunca el password)
const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};

export function findAllUsers() {
  return prisma.user.findMany({
    select: userSelect,
    orderBy: { id: "asc" },
  });
}

export function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
}

export function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: userSelect,
  });
}

// Uso exclusivo del login: es el único método que expone el hash.
// No devolver su resultado directamente en una respuesta HTTP.
export function findUserByEmailWithPassword(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export function createUser({ name, email, password, role }) {
  return prisma.user.create({
    data: { name, email, password, role },
    select: userSelect,
  });
}

// Registra un usuario guardando la contraseña hasheada, nunca en texto plano
export async function registerUser({ name, email, password, role }) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
    select: userSelect,
  });
}

export function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function updateUser(id, { name, email, password, role }) {
  return prisma.user.update({
    where: { id },
    data: { name, email, password, role },
    select: userSelect,
  });
}

export function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
    select: userSelect,
  });
}
