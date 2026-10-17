import { handle } from "@hono/vercel";
import { Hono } from "hono";
import { proxy } from "hono/proxy";

export const runtime = "edge";

const app = new Hono().basePath("/api/proxy");

const devServer = "localhost:3000";

app.get("/hello", (c) => c.text("Hello, World!"));

app.get("/backend/:path", async (c) => {
  // return proxy('https://example.com:80');
  console.log(`http://${devServer}/${c.req.param("path")}`);
  return await proxy(`http://${devServer}/api/health`);
});

export const GET = handle(app);
