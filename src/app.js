import express from "express";

import logger from "./middleware/logger.js";
import errorHandle from "./middleware/errorHandle.js";
import routes from "./routes/index.js";
import ApiError from "./utils/ApiError.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Rutas
app.use("/api", routes);

// 404: ninguna ruta coincidió
app.use((req, res, next) => {
  next(ApiError.notFound(`No existe la ruta ${req.method} ${req.originalUrl}`));
});

// Middleware de errores: siempre al final
app.use(errorHandle);

export default app;
