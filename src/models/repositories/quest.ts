import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { CreateRequest } from "../usecases/quests";
import { LimitOffsetRequest } from "../types/common";

const connectionString = "postgresql://japonmaster:password@localhost:5600/questory";
console.log("connectionString", connectionString);

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
 * @param payload.query クエスト名で検索するクエリ
 * @param payload.limit 取得するクエストの数
 * @param payload.offset 取得するクエストの開始位置
 * @returns クエスト一覧
 */
export const findAll = async (payload: LimitOffsetRequest): Promise<Quest[]> => {
  return await prisma.quest.findMany({
    where: {
      deletedAt: null,
      name: {
        contains: payload.query,
      },
    },
    skip: payload.offset,
    take: payload.limit,
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * クエストを作成する
 * @param uuid クエストのUUID
 * @param payload クエストのデータ
 * @returns 作成されたクエスト
 */
export const create = async (payload: { uuid: string } & CreateRequest) => {
  return await prisma.quest.create({
    data: {
      ...payload,
    },
  });
};

/**
 * クエストを更新する
 * @param uuid クエストのUUID
 * @param payload クエストのデータ
 * @returns 更新されたクエスト
 */
