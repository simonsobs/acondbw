import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue2";
import loadVersion from "vite-plugin-package-version";
import graphql from "@rollup/plugin-graphql";
import { VuetifyResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import path from "path-browserify";
import { defaultExclude } from "vitest/config";

export default ({ mode }) => {
  // loadEnv: https://stackoverflow.com/a/66389044/7309855
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: { port: 8081 },
    plugins: [
      vue(),
      loadVersion(),
      // @ts-ignore
      graphql(),
      Components({
        resolvers: [VuetifyResolver()],
      }),
    ],
    base: process.env.VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        path: "path-browserify",
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      alias: [{ find: /^vue$/, replacement: "vue/dist/vue.runtime.common.js" }],
      exclude: [...defaultExclude, "tests-old/**"],
      setupFiles: "./tests/unit/setup.ts",
    },
  });
};
