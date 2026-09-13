import bcrypt from "bcrypt";
import prisma from "../src/database/prisma.js";

// Seed global: limpia y recrea todas las tablas en un solo proceso.
// El orden importa en los dos sentidos (ver limpiarBase y main).

const SALT_ROUNDS = 10;
const SEED_PASSWORD = "password123";

// Fecha fija: un seed debe dar siempre el mismo resultado
const BASE_DATE = "2026-09-14";

// Bloques de 1 hora de 09:00 a 17:00, sin las 13:00 (almuerzo).
// Solo importa la hora: la fecha concreta la aporta cada Appointment.
const HOURS = [9, 10, 11, 12, 14, 15, 16];

const USERS = [
  { name: "Admin", email: "admin@example.com", role: "ADMIN" },
  { name: "Erick", email: "erick@example.com", role: "USER" },
  { name: "María", email: "maria@example.com", role: "USER" },
  { name: "Carlos", email: "carlos@example.com", role: "USER" },
  { name: "Ana", email: "ana@example.com", role: "USER" },
  { name: "Luis", email: "luis@example.com", role: "USER" },
  { name: "Sofía", email: "sofia@example.com", role: "USER" },
  { name: "Pedro", email: "pedro@example.com", role: "USER" },
];

// Se referencian por email, no por id: los autoincrement cambian entre bases
const POSTS = [
  {
    email: "erick@example.com",
    title: "Mi primer post",
    content: "Este es el primer post de Erick.",
  },
  {
    email: "erick@example.com",
    title: "Aprendiendo Prisma",
    content: "Estoy aprendiendo a trabajar con Prisma y PostgreSQL.",
  },
  {
    email: "maria@example.com",
    title: "Mi experiencia con Node.js",
    content: "Node.js permite construir backend usando JavaScript.",
  },
  {
    email: "carlos@example.com",
    title: "Introducción a Express",
    content: "Express es un framework muy usado para construir APIs.",
  },
  {
    email: "ana@example.com",
    title: "Bases de datos relacionales",
    content: "PostgreSQL es una excelente base de datos relacional.",
  },
  {
    email: "luis@example.com",
    title: "¿Qué es una API REST?",
    content: "Una API REST comunica aplicaciones mediante HTTP.",
  },
];

// Índice del bloque horario, no su id: los ids los asigna la base
const APPOINTMENTS = [
  { email: "erick@example.com", blockIndex: 0 },
  { email: "maria@example.com", blockIndex: 1 },
  { email: "carlos@example.com", blockIndex: 2 },
  { email: "erick@example.com", blockIndex: 3 },
  { email: "admin@example.com", blockIndex: 4 },
  { email: "ana@example.com", blockIndex: 5 },
];

function buildTimeBlock(hour) {
  return {
    startTime: new Date(Date.UTC(1970, 0, 1, hour, 0, 0)),
    endTime: new Date(Date.UTC(1970, 0, 1, hour + 1, 0, 0)),
  };
}

function atDate(day, hour) {
  return new Date(`${day}T${String(hour).padStart(2, "0")}:00:00.000Z`);
}

// Orden inverso al de creación: primero lo que tiene foreign keys
async function limpiarBase() {
  await prisma.appointment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.timeBlock.deleteMany();
  await prisma.user.deleteMany();

  console.log("Base limpiada");
}

async function seedUsers() {
  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);

  await prisma.user.createMany({
    data: USERS.map((user) => ({ ...user, password: hashedPassword })),
  });

  const users = await prisma.user.findMany({
    select: { id: true, email: true },
  });

  console.log(`${users.length} usuarios creados`);

  // Mapa email -> id para que el resto de los seeds no dependa de ids fijos
  return new Map(users.map((user) => [user.email, user.id]));
}

async function seedTimeBlocks() {
  await prisma.timeBlock.createMany({
    data: HOURS.map(buildTimeBlock),
  });

  const timeBlocks = await prisma.timeBlock.findMany({
    orderBy: { startTime: "asc" },
  });

  console.log(`${timeBlocks.length} bloques horarios creados`);

  return timeBlocks;
}

async function seedPosts(userIdByEmail) {
  await prisma.post.createMany({
    data: POSTS.map(({ email, title, content }) => ({
      title,
      content,
      userId: userIdByEmail.get(email),
    })),
  });

  console.log(`${POSTS.length} posts creados`);
}

async function seedAppointments(userIdByEmail, timeBlocks) {
  const appointments = APPOINTMENTS.map(({ email, blockIndex }) => {
    const timeBlock = timeBlocks[blockIndex];

    return {
      userId: userIdByEmail.get(email),
      timeBlockId: timeBlock.id,
      // date + timeBlockId es único: cada turno toma un bloque distinto
      date: atDate(BASE_DATE, timeBlock.startTime.getUTCHours()),
    };
  });

  await prisma.appointment.createMany({
    data: appointments,
  });

  console.log(`${appointments.length} turnos creados para ${BASE_DATE}`);
}

async function main() {
  console.log("Sembrando base de datos...\n");

  await limpiarBase();

  // Users y timeBlocks no dependen de nadie: pueden ir en paralelo
  const [userIdByEmail, timeBlocks] = await Promise.all([
    seedUsers(),
    seedTimeBlocks(),
  ]);

  // Posts y appointments sí dependen de los anteriores
  await seedPosts(userIdByEmail);
  await seedAppointments(userIdByEmail, timeBlocks);

  console.log(`\nSeed completado. Password de todos: ${SEED_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("\nEl seed falló:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
