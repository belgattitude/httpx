import { handle } from '@hono/node-server/vercel';
import { Hono } from 'hono';
import type { PageConfig } from 'next';

import { object, string } from 'valibot'


export const config: PageConfig = {
  runtime: 'nodejs',
  api: {
    bodyParser: false,
  },
};


const app = new Hono().basePath('/api/compress');

const schema = object({
  cParams: string(),
})

app.get('/test', (c) => {
  const data = c.req.query('cParams')
  return c.json({
    success: true,
    message: `${data}`,
  })
})

export default handle(app);
