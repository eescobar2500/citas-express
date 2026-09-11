import prisma from "../prisma.js";

async function main() {
  await prisma.post.deleteMany();
  /* await prisma.post.createMany({
    data: [
      {
        title: "Mi primer post",
        content: "Este es el primer post de Erick.",
        userId: 1,
      },
      {
        title: "Aprendiendo Prisma",
        content: "Estoy aprendiendo a trabajar con Prisma y PostgreSQL.",
        userId: 1,
      },
      {
        title: "Mi experiencia con Node.js",
        content:
          "Node.js permite construir aplicaciones backend utilizando JavaScript.",
        userId: 2,
      },
      {
        title: "Introducción a Express",
        content: "Express es un framework muy utilizado para construir APIs.",
        userId: 5,
      },
      {
        title: "Bases de datos relacionales",
        content: "PostgreSQL es una excelente base de datos relacional.",
        userId: 6,
      },
      {
        title: "Aprendiendo JavaScript",
        content:
          "JavaScript es uno de los lenguajes más utilizados en desarrollo web.",
        userId: 7,
      },
      {
        title: "Mi proyecto personal",
        content: "Estoy construyendo mi primer proyecto backend.",
        userId: 8,
      },
      {
        title: "¿Qué es una API REST?",
        content:
          "Una API REST permite comunicar diferentes aplicaciones mediante HTTP.",
        userId: 9,
      },
      {
        title: "Programación backend",
        content: "El desarrollo backend se encarga de la lógica del servidor.",
        userId: 10,
      },
      {
        title: "PostgreSQL y Prisma",
        content: "Prisma facilita el trabajo con bases de datos desde Node.js.",
        userId: 11,
      },
      {
        title: "Mi aprendizaje",
        content: "Cada día estoy aprendiendo algo nuevo sobre programación.",
        userId: 12,
      },
    ],
  });*/
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
