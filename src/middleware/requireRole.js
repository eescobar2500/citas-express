import ApiError from "../utils/ApiError.js";

// Debe usarse siempre después de `auth`: depende de req.user.
// 403 y no 401: el usuario está identificado, pero no autorizado.
const requireRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("No autenticado"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("Requiere rol de administrador"));
    }

    next();
  };

export default requireRole;
