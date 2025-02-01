import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
// import { bearerAuth } from 'hono/bearer-auth'
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { z } from "@hono/zod-openapi";

type Variables = JwtVariables;

const ParamsSchema = z.object({
  id: z
    .string()
    .min(3)
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1212121",
    }),
});

const UserSchema = z
  .object({
    id: z.string().openapi({
      example: "123",
    }),
    name: z.string().openapi({
      example: "John Doe",
    }),
    age: z.number().openapi({
      example: 42,
    }),
  })
  .openapi("User");

const app = new Hono<{ Variables: Variables }>();
// const token = 'honoyuzu'

// ログ出力
app.use(logger());

// Basic Auth
app.use(
  "*",
  basicAuth({
    username: "user",
    password: "password",
  })
);

// Bearer Auth
// app.use('*', bearerAuth({ token }))

app.use(
  "/auth/*",
  jwt({
    secret: "it-is-very-secret",
  })
);

app.use(prettyJSON());
app.use("*", requestId());

app.get("/", (c) => {
  return c.json({
    requestId: c.req.header("X-Request-Id"),
    message: "Hello Hono!",
  });
});

// app.get('/auth/page', (c) => {
//   return c.text('You are authorized')
// })

app.get("/auth/page", (c) => {
  const payload = c.get("jwtPayload");
  return c.json(payload); // eg: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }
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
