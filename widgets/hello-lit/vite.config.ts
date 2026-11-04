import { defineConfig } from "vite";
const externalPackages: string[] = ["@gainsight-hub/sdk"];
const isExternal = (id: string) => externalPackages.some((pkg) => id === pkg || id.startsWith(pkg + "/"));

export default defineConfig(({ command }) => ({
  server: {
    cors: true,
  },
  define: command === "build" ? { "process.env.NODE_ENV": JSON.stringify("production") } : {},
  build: {
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: "widget",
    },
    rollupOptions: {
      external: isExternal,
    },
  },
}));
