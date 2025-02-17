import { Hono } from 'hono';
import { proxy } from 'hono/proxy';
import { handle } from 'hono/vercel';
export const runtime = 'edge';

const app = new Hono().basePath('/api/proxy');

const devServer = 'localhost:3000';

app.get('/hello', (c) => {
  return c.text('Hello, World!');
});

app.get('/backend/:path', async (c) => {
  // return proxy('https://example.com:80');
  console.log(`http://${devServer}/${c.req.param('path')}`);
  return proxy(`http://${devServer}/api/health`);
});

export const GET = handle(app);
