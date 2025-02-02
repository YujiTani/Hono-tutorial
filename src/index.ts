import { Hono } from "hono";

import { basicAuth } from "hono/basic-auth";
// import { bearerAuth } from 'hono/bearer-auth'
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";

import routes from "./routes";

const app = new Hono().basePath("/api/v1");

app.route("/", routes);

// ログ出力
app.use(logger());

// 認証
app.use("*", basicAuth({ username: "user", password: "password" }));
// app.use('*', bearerAuth({ token }))

// MEMO: urlクエリパラメータに?prettyを追加することで整形されたJSONを返す
app.use(prettyJSON());
// MEMO: レスポンスにX-Request-Idヘッダーを追加
app.use("*", requestId());

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
