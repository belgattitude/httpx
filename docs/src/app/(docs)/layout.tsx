import { DocsLayout } from "fumadocs-ui/layouts/notebook";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/">) {
  const { nav, ...base } = baseOptions();
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...base}
      // full width header (logo, links, search...) above the sidebar
      nav={{ ...nav, mode: "top" }}
    >
      {children}
    </DocsLayout>
  );
}
