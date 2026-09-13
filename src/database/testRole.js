import prisma from "../database/prisma.js";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "cocoadmin",
      email: "coco@example.com",
      password: "123321",
      role: "dfg",
    },
  });

  console.log(user);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
