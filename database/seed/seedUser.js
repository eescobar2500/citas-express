import prisma from "../prisma.js";

const users = [
  { name: "María", email: "maria@example.com" },
  { name: "Carlos", email: "carlos@example.com" },
  { name: "Ana", email: "ana@example.com" },
  { name: "Luis", email: "luis@example.com" },
  { name: "Sofía", email: "sofia@example.com" },
  { name: "Pedro", email: "pedro@example.com" },
  { name: "Laura", email: "laura@example.com" },
  { name: "Diego", email: "diego@example.com" },
];

/*await prisma.user.createMany({
  data: users,
});*/

await prisma.user.rol.deleteMany();

console.log("10 usuarios creados");

await prisma.$disconnect();
