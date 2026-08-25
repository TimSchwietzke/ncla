declare module "*.mdx" {
  import type { ComponentType, ReactNode } from "react";

  /** Exported by remark-mdx-frontmatter — the YAML block at the top of the file. */
  export const frontmatter: Record<string, unknown>;

  const MDXContent: ComponentType<{
    components?: Record<string, ComponentType<{ children?: ReactNode }>>;
  }>;
  export default MDXContent;
}
