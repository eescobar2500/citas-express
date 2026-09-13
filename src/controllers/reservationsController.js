import {
  findReservationsByUser,
  findReservationById,
  findTimeBlockById,
  findReservationBySlot,
  createReservation as createReservationInDb,
  updateReservation as updateReservationInDb,
} from "../services/reservationsService.js";

import {
  validateReservationId,
  validateCreateReservation,
  validateUpdateReservation,
} from "../utils/validations/reservationValidation.js";

import ApiError from "../utils/ApiError.js";

import { Prisma } from "../generated/prisma/client.ts";

// El chequeo previo con findReservationBySlot cubre el caso normal, pero entre
// ese SELECT y el INSERT hay una ventana: dos requests simultáneas pueden
// pasar ambas. Ahí salta el @@unique([date, timeBlockId]) y Prisma tira P2002.
const isSlotConflict = (error) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === "P2002";

// El token guarda el id del usuario en `sub` (ver tokenService)
const isOwnerOrAdmin = (reservation, user) =>
  reservation.userId === user.sub || user.role === "ADMIN";

// Devuelve la reserva validando id, existencia y permisos.
// Lo comparten GET y PUT, así el chequeo vive en un solo lugar.
const getOwnedReservation = async (req) => {
  const reservationId = Number(req.params.id);

  const idValidation = validateReservationId(reservationId);

  if (!idValidation.valid) {
    throw ApiError.badRequest(idValidation.error);
  }

  const reservation = await findReservationById(reservationId);

  if (!reservation) {
    throw ApiError.notFound("Reserva no encontrada");
  }

  if (!isOwnerOrAdmin(reservation, req.user)) {
    throw ApiError.forbidden("No tenés permiso sobre esta reserva");
  }

  return reservation;
};

export const createReservation = async (req, res) => {
  const validation = validateCreateReservation(req.body);

  if (!validation.valid) {
    throw ApiError.badRequest(validation.error);
  }

  const { date, timeBlockId } = validation.data;

  const timeBlock = await findTimeBlockById(timeBlockId);

  if (!timeBlock) {
    throw ApiError.notFound("Bloque horario no encontrado");
  }

  const slotTaken = await findReservationBySlot({ date, timeBlockId });

  if (slotTaken) {
    throw ApiError.conflict("Ese bloque horario ya está reservado");
  }

  let reservation;

  try {
    // El dueño sale del token, nunca del body: así nadie reserva a nombre de otro
    reservation = await createReservationInDb({
      date,
      timeBlockId,
      userId: req.user.sub,
    });
  } catch (error) {
    if (isSlotConflict(error)) {
      throw ApiError.conflict("Ese bloque horario ya está reservado");
    }

    throw error;
  }

  res.status(201).json({
    message: "Reserva creada correctamente",
    reservation,
  });
};

export const getReservations = async (req, res) => {
  const { date } = req.query;

  let parsedDate;

  if (date) {
    parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      throw ApiError.badRequest("La fecha no tiene un formato válido");
    }
  }

  // Siempre acotado al usuario del token: nadie lista reservas ajenas
  const reservations = await findReservationsByUser(req.user.sub, parsedDate);

  res.json({
    ...(date ? { date } : {}),
    total: reservations.length,
    reservations,
  });
};

export const getReservation = async (req, res) => {
  const { userId, ...reservation } = await getOwnedReservation(req);

  res.json(reservation);
};

export const updateReservation = async (req, res) => {
  const existingReservation = await getOwnedReservation(req);

  const validation = validateUpdateReservation(req.body);

  if (!validation.valid) {
    throw ApiError.badRequest(validation.error);
  }

  const { data } = validation;

  if (data.timeBlockId !== undefined) {
    const timeBlock = await findTimeBlockById(data.timeBlockId);

    if (!timeBlock) {
      throw ApiError.notFound("Bloque horario no encontrado");
    }
  }

  // Los campos que no vienen en el body conservan su valor actual
  const slotTaken = await findReservationBySlot({
    date: data.date ?? existingReservation.date,
    timeBlockId: data.timeBlockId ?? existingReservation.timeBlock.id,
    excludeId: existingReservation.id,
  });

  if (slotTaken) {
    throw ApiError.conflict("Ese bloque horario ya está reservado");
  }

  let reservation;

  try {
    reservation = await updateReservationInDb(existingReservation.id, data);
  } catch (error) {
    if (isSlotConflict(error)) {
      throw ApiError.conflict("Ese bloque horario ya está reservado");
    }

    throw error;
  }

  res.json({
    message: "Reserva actualizada correctamente",
    reservation,
  });
};
