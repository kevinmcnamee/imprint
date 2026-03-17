import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["packages/*/test/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html"]
    }
  }
});
