import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import { contentIndexPlugin } from "./scripts/vite-plugin-content-index.ts";

export default defineConfig({
  plugins: [
    contentIndexPlugin(),
    // MDX must run before the React plugin so that it sees plain JSX.
    { enforce: "pre", ...mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkGfm, remarkFrontmatter, [remarkMdxFrontmatter, { name: "frontmatter" }]],
      rehypePlugins: [
        // Highlighting happens at build time; no highlighter ships to the browser.
        [rehypeShiki, { themes: { light: "github-light", dark: "github-dark" } }],
      ],
    }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    open: false,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
  },
});
