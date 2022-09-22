import { mergeConfig } from "vite";
import { defineConfig, defaultExclude } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: [...defaultExclude, "tests-old/**"],
    },
  })
);
