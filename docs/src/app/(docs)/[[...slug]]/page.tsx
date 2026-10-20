import { findNeighbour } from "fumadocs-core/page-tree";
import type { Item } from "fumadocs-core/page-tree";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/notebook/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMDXComponents } from "@/components/mdx";
import { getPageMarkdownUrl, gitConfig } from "@/lib/shared";
import { source } from "@/lib/source";

// package main pages are labelled "Overview" in the sidebar, use their
// title (ie: "@httpx/exception") in the previous / next links
const withPageTitle = (item?: Item) =>
  item && {
    ...item,
    name: source.getNodePage(item)?.data.title ?? item.name,
  };

export default async function Page(props: PageProps<"/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const MdxContent = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const { user, repo, branch, contentDir } = gitConfig;

  const neighbours = findNeighbour(source.getPageTree(), page.url);

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      footer={{
        items: {
          previous: withPageTitle(neighbours.previous),
          next: withPageTitle(neighbours.next),
        },
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row items-center gap-2 border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${user}/${repo}/blob/${branch}/${contentDir}/${page.path}`}
        />
      </div>
      <DocsBody>
        <MdxContent
          components={getMDXComponents({
            // allows linking to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/[[...slug]]">
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description ?? "@httpx documentation",
  };
}
