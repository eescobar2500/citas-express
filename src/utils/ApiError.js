// Error con status HTTP. errorHandle lee `statusCode` para responder,
// así los controllers lanzan en vez de armar la respuesta de error.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.name = "ApiError";
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Credenciales inválidas") {
    return new ApiError(401, message);
  }

  static forbidden(message = "No tenés permiso para esta acción") {
    return new ApiError(403, message);
  }

  static notFound(message = "Recurso no encontrado") {
    return new ApiError(404, message);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }
}

export default ApiError;
