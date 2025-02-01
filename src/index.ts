import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'

import { View } from './test'

const app = new Hono()


// Basic Auth
app.use(
  '*',
  basicAuth({
    username: 'user',
    password: 'password',
  })
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello', (c) => {
  return c.json({ message: 'Hello Hono!' })
})

app.get('/post/:id', async (c) => {
  const id = c.req.param('id')
  const page = c.req.query('page')
  c.header('Content-Type', 'application/json')
  c.header('X-message', 'Hi!')
  return c.text(`You want to see ${page} of ${id}`)
})

const posts = [
  { id: 1, title: 'Honoフレームワークを使ってみた', content: 'Honoは軽量で高速なWebフレームワークです。今回はHonoを使って簡単なAPIを作ってみました。' },
  { id: 2, title: 'エッジコンピューティングの未来', content: 'エッジコンピューティングは、クラウドコンピューティングの次の革新として注目されています。本記事では、その可能性について探ります。' },
  { id: 3, title: 'Web開発のベストプラクティス2024', content: '最新のWeb開発トレンドとベストプラクティスについて解説します。パフォーマンス、セキュリティ、アクセシビリティの観点から考察します。' },
]

app.get('/posts', (c) => {
  return c.json(posts)
})

app.delete('/posts/:id', (c) =>
  c.text(`${c.req.param('id')} is deleted!`)
)


export default app
