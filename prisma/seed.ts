import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const questData: Prisma.QuestCreateInput[] = [...Array(100)].map((_, i) => ({
  name: `Quest${i + 1}`,
  description: `Quest${i + 1} description`,
  state: "DRAFT",
}));

const main = async () => {
  const result = await prisma.quest.createMany({
    data: questData,
    skipDuplicates: true,
  });
  console.log({ result });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
