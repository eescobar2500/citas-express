import prisma from "../database/prisma.js";

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

export function createUser({ name, email, password, role }) {
  return prisma.user.create({
    data: { name, email, password, role },
    select: userSelect,
  });
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
