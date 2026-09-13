import prisma from "../database/prisma.js";

const appointmentSelect = {
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

export function findAllTimeBlocks() {
  return prisma.timeBlock.findMany({
    orderBy: { startTime: "asc" },
  });
}

// Los bloques son franjas reutilizables: solo importa la hora.
// La fecha ancla (1970-01-01) la aporta cada Appointment con su `date`.
export function buildTimeBlockDate(hour) {
  return new Date(Date.UTC(1970, 0, 1, hour, 0, 0));
}

export function findTimeBlockByHours(startHour, endHour) {
  return prisma.timeBlock.findFirst({
    where: {
      startTime: buildTimeBlockDate(startHour),
      endTime: buildTimeBlockDate(endHour),
    },
  });
}

export function createTimeBlock({ startHour, endHour }) {
  return prisma.timeBlock.create({
    data: {
      startTime: buildTimeBlockDate(startHour),
      endTime: buildTimeBlockDate(endHour),
    },
  });
}

export function findAllAppointments() {
  return prisma.appointment.findMany({
    select: appointmentSelect,
    orderBy: { date: "asc" },
  });
}

export function findAppointmentsByDate(date) {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

  return prisma.appointment.findMany({
    where: {
      date: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    select: appointmentSelect,
    orderBy: { date: "asc" },
  });
}
