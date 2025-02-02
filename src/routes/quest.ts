import { Hono } from "hono";
import { v7 as uuidv7 } from "uuid";
import { PrismaClient, type Prisma } from "@prisma/client";

import * as questUsecase from "../models/usecases/quests";

const prisma = new PrismaClient();

// prisma の Quest モデルを参照
/**
 * クエストを作成するためのリクエスト
 */
type CreateQuestRequest = Pick<Prisma.QuestCreateInput, "name" | "description" | "state">;

/**
 * クエストを取得するためのリクエスト
 */
type FindQuestRequest = {
  id?: number;
  uuid?: string;
  query?: string;
  limit?: number;
  offset?: number;
};

/**
 * クエストを更新するためのリクエスト
 */
type UpdateQuestRequest = Pick<Prisma.QuestUpdateInput, "name" | "description" | "state"> & {
  id?: number;
  uuid?: string;
};

/**
 * クエストを削除するためのリクエスト
 */
type DeleteQuestRequest = {
  id?: number;
  uuid?: string;
};

/**
 * 一覧系基本レスポンス
 */
type BaseResponse = {
  total: number;
  limit: number;
  offset: number;
};

/**
 * クエスト一覧を返すレスポンス
 */
type QuestListResponse = {
  quests: QuestResponse[];
} & BaseResponse;

/**
 * クエストを返すレスポンス
 */
type QuestResponse = {
  uuid: string;
  name: string;
  description: string | null;
  state: string;
};

// MEMO: RPC 機能を使う場合、routeはメソッドチェーンで記述する
const app = new Hono()
  /**
   * クエスト一覧を取得する
   */
  .get("/", async (c) => {
    const limit = c.req.query("limit") ? Number(c.req.query("limit")) : 50;
    const offset = c.req.query("offset") ? Number(c.req.query("offset")) : 0;
    const total = await questUsecase.getCount();
    const quests = await questUsecase.getAll(limit, offset);

    if (total === 0) {
      const response: QuestListResponse = await questUsecase.getQuestListResponse(quests, total, limit, offset);
      return c.json(response, 200);
    }

    const response: QuestListResponse = await questUsecase.getQuestListResponse(quests, total, limit, offset);
    return c.json(response, 200);
  })
  .post("/", async (c) => {
    const uuid = uuidv7();
    const { name, description, state } = await c.req.json();

    const quest = await prisma.quest.create({
      data: { uuid, name, description, state },
    });

    const response: QuestResponse = await questUsecase.getQuestResponse(quest);

    return c.json(response, 201);
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const quest = await prisma.quest.findUnique({
      where: { id: Number(id) },
    });

    if (!quest) {
      return c.json({ error: "Quest not found" }, 404);
    }

    const response: QuestResponse = {
      uuid: quest.uuid,
      name: quest.name,
      description: quest.description,
      state: quest.state,
    };

    return c.json(response, 200);
  });

export default app;
