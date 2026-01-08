const isBrowser = typeof window !== 'undefined';
if (!isBrowser) {
  const { config } = await import('@dotenvx/dotenvx').then((mod) => mod);
  config({ path: ['.env.local'] });
}
export {};
