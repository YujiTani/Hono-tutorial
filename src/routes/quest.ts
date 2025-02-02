import { Hono } from 'hono'

// MEMO: RPC 機能を使う場合、routeはメソッドチェーンで記述する
const app = new Hono()
  .get("/", (c) => c.json("list quests"))
  .post("/", (c) => c.json("create a quest", 201))
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default app