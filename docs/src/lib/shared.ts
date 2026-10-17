import { createGetUrl } from "fumadocs-core/source";

export const appName = "@httpx";
export const docsRoute = "/";
export const docsContentRoute = "/llms.mdx";

/** The next `basePath` (ie: "/httpx" on GitHub pages), "" when none */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const gitConfig = {
  user: "belgattitude",
  repo: "httpx",
  branch: "main",
  contentDir: "docs/content/docs",
};

const getContentUrl = createGetUrl(docsContentRoute);

/**
 * Url of the markdown version of a page, prefixed by the basePath as it is
 * fetched by the client (not a next link).
 */
export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "content.md"];

  return {
    segments,
    url: `${basePath}${getContentUrl(segments, page.locale)}`,
  };
}
