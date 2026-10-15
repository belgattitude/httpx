// @ts-check

/**
 * No `cooldown` here: ncu reads `minimumReleaseAge` / `minimumReleaseAgeExclude`
 * from pnpm-workspace.yaml when it's not set (only package-name patterns are
 * honored, `pkg@version` excludes are ignored).
 *
 * @type {import('npm-check-updates').RcOptions}
 */
export default {
  workspaces: true,
  mergeConfig: true,
  root: true,
  packageManager: "pnpm",
  reject: [
    "primereact",
    // Till documentation website is upgraded
    "nextra",
    "nextra-theme-docs",
    "@changesets/changelog-github",
    "@changesets/cli",
  ],
};
