import prisma from "../database/prisma.js";

// `select` explícito: nunca exponemos el password del user en la respuesta
const reservationSelect = {
  id: true,
  date: true,
  timeBlock: {
    select: {
      id: true,
      startTime: true,
      endTime: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

// Sin `date` devuelve todas las del usuario; con `date` acota a ese día.
// El rango es [00:00, 00:00 del día siguiente) para que el filtro funcione
// aunque la reserva tenga hora, igual que en appointmentService.
export function findReservationsByUser(userId, date) {
  const where = { userId };

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    where.date = {
      gte: startOfDay,
      lt: endOfDay,
    };
  }

  return prisma.appointment.findMany({
    where,
    select: reservationSelect,
    orderBy: { date: "asc" },
  });
}

export function findReservationById(id) {
  return prisma.appointment.findUnique({
    where: { id },
    select: { ...reservationSelect, userId: true },
  });
}

export function findTimeBlockById(id) {
  return prisma.timeBlock.findUnique({
    where: { id },
  });
}

// Un slot es la combinación fecha + bloque horario. `excludeId` sirve en el
// update para no chocar contra la propia reserva que estamos modificando.
export function findReservationBySlot({ date, timeBlockId, excludeId }) {
  return prisma.appointment.findFirst({
    where: {
      date,
      timeBlockId,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
}

export function createReservation({ date, timeBlockId, userId }) {
  return prisma.appointment.create({
    data: { date, timeBlockId, userId },
    select: reservationSelect,
  });
}

export function updateReservation(id, data) {
  return prisma.appointment.update({
    where: { id },
    data,
    select: reservationSelect,
  });
}
