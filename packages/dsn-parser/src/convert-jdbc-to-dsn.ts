export const convertJdbcToDsn = (jdbc: string): string => {
  const [part1, ...rest] = jdbc.split(';');
  return [part1, rest ? rest.join('&') : undefined].filter(Boolean).join('?');
};
