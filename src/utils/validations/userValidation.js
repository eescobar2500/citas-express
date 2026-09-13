const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ROLES = ["ADMIN", "USER"];

export function validateCreateUser({ name, email, password, role }) {
  if (!name || !email || !password || !role) {
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

  if (typeof password !== "string" || password.length < 6) {
    return {
      valid: false,
      error: "La contraseña debe tener al menos 6 caracteres",
    };
  }

  if (!ROLES.includes(role)) {
    return {
      valid: false,
      error: `El rol debe ser uno de: ${ROLES.join(", ")}`,
    };
  }

  return {
    valid: true,
  };
}

// El login solo verifica presencia: las reglas de formato son del registro.
// Validar aquí la longitud filtraría si un password existente es válido o no.
export function validateLogin({ email, password }) {
  if (!email || !password) {
    return {
      valid: false,
      error: "El email y la contraseña son obligatorios",
    };
  }

  return {
    valid: true,
  };
}

// El registro no recibe `role`: el servidor siempre asigna USER
export function validateRegisterUser({ name, email, password }) {
  if (!name || !email || !password) {
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

  if (typeof password !== "string" || password.length < 6) {
    return {
      valid: false,
      error: "La contraseña debe tener al menos 6 caracteres",
    };
  }

  return {
    valid: true,
  };
}

export function validateUpdateUser({ name, email, password, role }) {
  if (!name || !email || !password || !role) {
    return {
      valid: false,
      error: "Todos los campos son obligatorios",
    };
  }

  return validateCreateUser({ name, email, password, role });
}

export function validateUserId(id) {
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
