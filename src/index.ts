import { Hono } from "hono";

import { every } from "hono/combine";
// import { bearerAuth } from 'hono/bearer-auth'
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";

import routes from "./routes";
import { customAuth } from "./middlewares/auth";

const app = new Hono();

/**
 * 必ず適用するミドルウェアを combine の every でまとめている
 * 認証が失敗した場合、以降のミドルウェアは実行されない
 * https://hono-ja.pages.dev/docs/middleware/builtin/combine
 */
app.use("*", async (c, next) => {
  await every(customAuth, logger(), prettyJSON(), requestId())(c, next);
});

app.route("/api/v1", routes);

app.get("/", (c) => {
  return c.json({
    requestId: c.req.header("X-Request-Id"),
    message: "Hello Hono!",
  });
});

app.get("/hello", (c) => {
  return c.json({ message: "Hello Hono!" });
});

app.get("/post/:id", async (c) => {
  const id = c.req.param("id");
  const page = c.req.query("page");
  c.header("Content-Type", "application/json");
  c.header("X-message", "Hi!");
  return c.text(`You want to see ${page} of ${id}`);
});

const posts = [
  {
    id: 1,
    title: "Honoフレームワークを使ってみた",
    content: "Honoは軽量で高速なWebフレームワークです。今回はHonoを使って簡単なAPIを作ってみました。",
  },
  {
    id: 2,
    title: "エッジコンピューティングの未来",
    content:
      "エッジコンピューティングは、クラウドコンピューティングの次の革新として注目されています。本記事では、その可能性について探ります。",
  },
  {
    id: 3,
    title: "Web開発のベストプラクティス2024",
    content:
      "最新のWeb開発トレンドとベストプラクティスについて解説します。パフォーマンス、セキュリティ、アクセシビリティの観点から考察します。",
  },
];

app.get("/posts", (c) => {
  return c.json({
    requestId: c.req.header("X-Request-Id"),
    posts: [...posts],
  });
});

app.delete("/posts/:id", (c) => c.text(`${c.req.param("id")} is deleted!`));

export default app;
