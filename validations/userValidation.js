const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateCreateUser({ name, email, age, id }) {
  if (!name || !email || age === undefined || id === undefined) {
    return {
      valid: false,
      error: "Todos los campos son obligatorios",
    };
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return {
      valid: false,
      error: "El nombre debe tener al menos 2 caracteres",
    };
  }

  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: "El email no tiene un formato válido",
    };
  }

  if (!Number.isInteger(age) || age <= 0) {
    return {
      valid: false,
      error: "La edad debe ser un número entero mayor que 0",
    };
  }

  if (!Number.isInteger(id) || id <= 0) {
    return {
      valid: false,
      error: "El ID debe ser un número entero mayor que 0",
    };
  }

  return {
    valid: true,
  };
}

export function validateUpdateUser({ name, email, age }) {
  if (!name || !email || age === undefined) {
    return {
      valid: false,
      error: "Todos los campos son obligatorios",
    };
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return {
      valid: false,
      error: "El nombre debe tener al menos 2 caracteres",
    };
  }

  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: "El email no tiene un formato válido",
    };
  }

  if (!Number.isInteger(age) || age <= 0) {
    return {
      valid: false,
      error: "La edad debe ser un número entero mayor que 0",
    };
  }

  return {
    valid: true,
  };
}
