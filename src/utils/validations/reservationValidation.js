export function validateReservationId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    return {
      valid: false,
      error: "El id de la reserva debe ser un número entero positivo",
    };
  }

  return {
    valid: true,
  };
}

// Valida y normaliza la fecha: el controller usa el Date ya parseado
function parseDate(date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

export function validateCreateReservation({ date, timeBlockId }) {
  if (date === undefined || timeBlockId === undefined) {
    return {
      valid: false,
      error: "date y timeBlockId son obligatorios",
    };
  }

  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return {
      valid: false,
      error: "La fecha no tiene un formato válido",
    };
  }

  if (!Number.isInteger(timeBlockId) || timeBlockId <= 0) {
    return {
      valid: false,
      error: "timeBlockId debe ser un número entero positivo",
    };
  }

  return {
    valid: true,
    data: { date: parsedDate, timeBlockId },
  };
}

export function validateUpdateReservation({ date, timeBlockId }) {
  if (date === undefined && timeBlockId === undefined) {
    return {
      valid: false,
      error: "Enviá al menos date o timeBlockId para actualizar",
    };
  }

  const data = {};

  if (date !== undefined) {
    const parsedDate = parseDate(date);

    if (!parsedDate) {
      return {
        valid: false,
        error: "La fecha no tiene un formato válido",
      };
    }

    data.date = parsedDate;
  }

  if (timeBlockId !== undefined) {
    if (!Number.isInteger(timeBlockId) || timeBlockId <= 0) {
      return {
        valid: false,
        error: "timeBlockId debe ser un número entero positivo",
      };
    }

    data.timeBlockId = timeBlockId;
  }

  return {
    valid: true,
    data,
  };
}
