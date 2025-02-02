import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Prisma の Quest モデルを参照
export type Quest = Prisma.QuestGetPayload<{}>;

/**
 * クエストの総数を取得する
 * @returns クエストの総数
 */
export const count = async () => {
  return await prisma.quest.count({
    where: {
      deletedAt: null,
    },
  });
};

/**
 * クエスト一覧を取得する
 * @param limit 取得するクエストの数
 * @param offset 取得するクエストの開始位置
 * @returns クエスト一覧
 */
export const findAll = async (limit: number, offset: number): Promise<Quest[]> => {
  return await prisma.quest.findMany({
    where: {
      deletedAt: null,
    },
    skip: offset,
    take: limit,
  });
};
