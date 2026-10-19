import Link from "fumadocs-core/link";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { getLayoutTabs } from "fumadocs-ui/layouts/shared";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

import { source } from "@/lib/source";

const DefaultImage = defaultMdxComponents.img;

/**
 * Remote images (shields.io badges...) have no known size: render them with a
 * plain <img> instead of next/image (the static export is unoptimized anyway).
 */
const MdxImage = (props: ComponentProps<typeof DefaultImage>) => {
  if (typeof props.src === "string" && /^https?:\/\//.test(props.src)) {
    const { src, alt, title, className } = props;
    // oxlint-disable-next-line nextjs/no-img-element
    return <img src={src} alt={alt} title={title} className={className} />;
  }
  return <DefaultImage {...props} />;
};

/**
 * All packages (hand-written and README docs), as in the package switcher
 */
const PackageTable = () => (
  <table className="rounded border shadow-lg">
    <thead>
      <tr>
        <th>Project</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {getLayoutTabs(source.getPageTree()).map((tab) => (
        <tr key={tab.url}>
          <td>
            {/* prefixed with the basePath (ie: GitHub pages), unlike <a> */}
            <Link href={tab.url}>{tab.title}</Link>
          </td>
          <td>{tab.description}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    img: MdxImage,
    PackageTable,
    Tab,
    Tabs,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
