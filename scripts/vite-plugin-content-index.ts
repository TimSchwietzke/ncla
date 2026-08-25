import type { Plugin } from "vite";
import { buildIndex } from "./build-index.ts";

/**
 * Keeps `src/data/generated/index.ts` in sync while the dev server runs, so adding a
 * problem MDX file makes it show up in the lists without restarting Vite.
 */
export function contentIndexPlugin(): Plugin {
  return {
    name: "ncla:content-index",
    async buildStart() {
      await buildIndex();
    },
    configureServer(server) {
      const rebuild = (file: string): void => {
        if (!file.endsWith(".mdx")) return;
        void buildIndex().catch((error: unknown) => {
          server.config.logger.error(`content index failed: ${String(error)}`);
        });
      };
      server.watcher.on("add", rebuild);
      server.watcher.on("change", rebuild);
      server.watcher.on("unlink", rebuild);
    },
  };
}
