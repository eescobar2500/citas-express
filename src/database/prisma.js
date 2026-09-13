import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

// El proxy local de Railway (127.0.0.1) presenta el certificado del server
// remoto, así que la verificación de hostname falla. Se controla el SSL desde
// acá en vez de por `sslmode` en la URL: en pg 8 `sslmode=require` implica
// verify-full y pisaría esta configuración.
const connectionString = process.env.DATABASE_URL.replace(
  /[?&]sslmode=[^&]*/,
  ""
);

const needsSsl = /sslmode=(require|verify)/.test(process.env.DATABASE_URL);

const pool = new Pool({
  connectionString,
  ...(needsSsl && { ssl: { rejectUnauthorized: false } }),
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
