import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

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

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    img: MdxImage,
    Tab,
    Tabs,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
