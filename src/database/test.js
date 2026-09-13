import prisma from "./prisma.js";

const user = await prisma.user.create({
  data: {
    name: "Jose",
    email: "jose@example.com",
  },
});

console.log(user);

await prisma.$disconnect();
