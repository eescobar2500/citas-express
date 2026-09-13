import "dotenv/config";

// Punto único de acceso a las variables de entorno.
// Ningún otro módulo debería leer process.env directamente.

const required = ["DATABASE_URL", "JWT_SECRET"];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Faltan variables de entorno obligatorias: ${missing.join(", ")}`
  );
}

const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  },
};

export default env;
