## @belgattitude/http-exception playground

Example app based on nextjs demonstrate some interesting possible integrations.

```
yarn install
cd ./examples/nextjs-app
yarn dev
```

### Highlights

#### Nextjs Api route

How to validate incoming request with zod,
catch errors via a global error handler and log them taking
advantage of [http-exception](https://github.com/belgattitude/http-exception).

Links

- api route: [src/pages/api/status/[statusCode]](./src/pages/api/status/%5BstatusCode%5D.tsx). try
  it on [http://localhost:3000/api/status/404](http://localhost:3000/api/status/404), adapt
  the statusCode to any number or string to check to behaviour. Check the logger in the console.
- withApiErrorHandler: [src/backend/withApiErrorHandler](src/server/withApiErrorHandler.ts).
- parseRequestWithZod: [src/backend/parseRequestWithZod.ts](src/server/parseRequestWithZod.ts);
- logget: [src/lib/logger.ts](src/lib/logger.ts);

### Notes

#### Development

> Will use tsconfig path aliases, changes in @belgattitude/http-exception packages
> are immediately reflected

```
yarn dev
```

#### Build

> Won't use tsconfig path aliases and thus requires a build of @belgattitude/http-exception packages.

```
yarn g:build-packages
yarn build
yarn start
```
