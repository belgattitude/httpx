import { llms, loader } from "fumadocs-core/source";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { applyMdxPreset } from "fumadocs-mdx/config";
import { defineDocs } from "fumadocs-mdx/macro";
import rehypeRaw from "rehype-raw";

import { docsRoute } from "./shared";

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    mdxOptions: applyMdxPreset({
      // don't fetch the size of remote images (shields.io badges...) at build
      // time, they're rendered with a plain <img> (see components/mdx.tsx)
      remarkImageOptions: { external: false },
      // render the raw html of the generated README docs (.md files), mdx
      // nodes are left untouched
      rehypePlugins: (plugins) => [
        [
          rehypeRaw,
          {
            passThrough: [
              "mdxjsEsm",
              "mdxFlowExpression",
              "mdxJsxFlowElement",
              "mdxJsxTextElement",
              "mdxTextExpression",
            ],
          },
        ],
        ...plugins,
      ],
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

/**
 * @link https://fumadocs.dev/docs/headless/source-api
 */
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [
    {
      name: "package-overview",
      transformPageTree: {
        // the package name is already in the switcher, label its main page
        // (ie: "exception/index.mdx", "(readme)/lru/index.md") "Overview" in
        // the sidebar
        file(node, filePath) {
          if (
            filePath !== undefined &&
            /^(\([^/]+\)\/)?[^/]+\/index\.mdx?$/.test(filePath)
          ) {
            return { ...node, name: "Overview" };
          }
          return node;
        },
      },
    },
  ],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
});
