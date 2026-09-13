import env from "./config/env.js";
import app from "./app.js";
import prisma from "./database/prisma.js";

const server = app.listen(env.port, () => {
  console.log(`Server is running at http://localhost:${env.port}`);
  console.log(`Entorno: ${env.nodeEnv}`);
});

// Cierra el servidor y la conexión a la base antes de terminar el proceso.
// Sin esto, un deploy o un Ctrl+C cortan las requests en curso.
const shutdown = async (signal) => {
  console.log(`\n${signal} recibido, cerrando el servidor...`);

  server.close(async () => {
    await prisma.$disconnect();

    console.log("Servidor cerrado correctamente");

    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default server;
