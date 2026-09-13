import { Prisma } from "../generated/prisma/client.ts";

// Traduce errores de Prisma a status HTTP. Sin esto, una violación de
// constraint saldría como 500 con el mensaje crudo del driver.
const translatePrismaError = (err) => {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  switch (err.code) {
    // Unique constraint: dos requests concurrentes ganaron la misma carrera
    case "P2002":
      return {
        statusCode: 409,
        message: "El recurso ya existe o está ocupado",
      };

    // Foreign key inválida: se referenció un registro que no existe
    case "P2003":
      return {
        statusCode: 400,
        message: "Alguna referencia enviada no es válida",
      };

    // El registro a actualizar/eliminar no existe
    case "P2025":
      return {
        statusCode: 404,
        message: "Recurso no encontrado",
      };

    default:
      return null;
  }
};

const errorHandle = (err, req, res, next) => {
  const prismaError = translatePrismaError(err);

  const statusCode = prismaError?.statusCode || err.statusCode || 500;
  const message =
    prismaError?.message || err.message || "Ocurrió un error inesperado";

  console.error(`${new Date().toISOString()} - ${statusCode} - ${message}`);

  if (err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorHandle;
