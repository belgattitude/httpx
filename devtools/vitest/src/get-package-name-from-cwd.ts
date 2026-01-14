export const getPackageNameFromCwd = () => {
  const cwd = process.cwd();
  const parts = cwd.split('/');
  const projectDir = parts.at(-1);
  if (typeof projectDir !== 'string') {
    throw new TypeError(
      `Couldn't determine current project name from "${cwd}"`
    );
  }
  return projectDir;
};
