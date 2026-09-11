const errorHandle = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Ocurrió un error inesperado";

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
