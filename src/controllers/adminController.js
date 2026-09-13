import {
  findAllTimeBlocks,
  findTimeBlockByHours,
  createTimeBlock,
  findAllAppointments,
  findAppointmentsByDate,
} from "../services/appointmentService.js";

import { validateCreateTimeBlock } from "../utils/validations/timeBlockValidation.js";

import ApiError from "../utils/ApiError.js";

export const getTimeBlocks = async (req, res) => {
  const timeBlocks = await findAllTimeBlocks();

  res.json({
    total: timeBlocks.length,
    timeBlocks,
  });
};

export const postTimeBlock = async (req, res) => {
  const { startHour, endHour } = req.body;

  const validation = validateCreateTimeBlock({ startHour, endHour });

  if (!validation.valid) {
    throw ApiError.badRequest(validation.error);
  }

  const existingBlock = await findTimeBlockByHours(startHour, endHour);

  if (existingBlock) {
    throw ApiError.conflict("Ya existe un bloque con ese horario");
  }

  const timeBlock = await createTimeBlock({ startHour, endHour });

  res.status(201).json({
    message: "Bloque horario creado correctamente",
    timeBlock,
  });
};

export const getReservations = async (req, res) => {
  const { date } = req.query;

  // Sin ?date devuelve todas; con ?date=YYYY-MM-DD filtra por ese día
  if (!date) {
    const appointments = await findAllAppointments();

    return res.json({
      total: appointments.length,
      appointments,
    });
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    throw ApiError.badRequest("La fecha no tiene un formato válido");
  }

  const appointments = await findAppointmentsByDate(parsedDate);

  res.json({
    date,
    total: appointments.length,
    appointments,
  });
};
