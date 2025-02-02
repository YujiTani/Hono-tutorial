import { Hono } from 'hono'
import quests from './quest'

const app = new Hono()

app.route('/quests', quests)

export default app
