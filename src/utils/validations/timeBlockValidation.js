export function validateCreateTimeBlock({ startHour, endHour }) {
  if (startHour === undefined || endHour === undefined) {
    return {
      valid: false,
      error: "startHour y endHour son obligatorios",
    };
  }

  if (!Number.isInteger(startHour) || !Number.isInteger(endHour)) {
    return {
      valid: false,
      error: "startHour y endHour deben ser números enteros",
    };
  }

  if (startHour < 0 || startHour > 23) {
    return {
      valid: false,
      error: "startHour debe estar entre 0 y 23",
    };
  }

  // 24 es válido como fin: representa la medianoche del día siguiente
  if (endHour < 1 || endHour > 24) {
    return {
      valid: false,
      error: "endHour debe estar entre 1 y 24",
    };
  }

  if (endHour <= startHour) {
    return {
      valid: false,
      error: "endHour debe ser posterior a startHour",
    };
  }

  return {
    valid: true,
  };
}
