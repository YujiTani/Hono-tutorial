import { Context, Next } from 'hono'
import { basicAuth } from "hono/basic-auth";

export const customAuth = (c: Context, next: Next) => {
    const auth = basicAuth({ username: "user", password: "password" })
    return auth(c, next)
}
