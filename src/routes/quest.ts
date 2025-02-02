import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

import * as questUsecase from "../models/usecases/quests";

const prisma = new PrismaClient();

// MEMO: RPC 機能を使う場合、routeはメソッドチェーンで記述する
const app = new Hono()
  /**
   * クエスト一覧を取得する
   */
  .get("/", async (c) => {
    const query = c.req.query("query") ?? "";
    const limit = c.req.query("limit") ? Number(c.req.query("limit")) : 50;
    const offset = c.req.query("offset") ? Number(c.req.query("offset")) : 0;
    const total = await questUsecase.getCount();
    const quests = await questUsecase.getAll({ query, limit, offset });

    if (total === 0) {
      const response: questUsecase.QuestListResponse = await questUsecase.getQuestListResponse(
        quests,
        total,
        limit,
        offset
      );
      return c.json(response, 200);
    }

    const response: questUsecase.QuestListResponse = await questUsecase.getQuestListResponse(
      quests,
      total,
      limit,
      offset
    );
    return c.json(response, 200);
  })
  .post("/", async (c) => {
    const { name, description, state } = await c.req.json();
    const quest = await questUsecase.create({ name, description, state });
    const response: questUsecase.QuestResponse = await questUsecase.getQuestResponse(quest);
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

    const response: questUsecase.QuestResponse = {
      uuid: quest.uuid,
      name: quest.name,
      description: quest.description,
      state: quest.state,
    };

    return c.json(response, 200);
  });

export default app;
