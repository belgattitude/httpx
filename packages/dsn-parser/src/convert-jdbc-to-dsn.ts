export const convertJdbcToDsn = (jdbc: string): string => {
  const [part1, ...rest] = jdbc.split(';');
  return `${part1}?${(rest ?? []).join('&')}`;
};
