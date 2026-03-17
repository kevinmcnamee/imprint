import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  format: ["esm"],
  sourcemap: true,
  clean: true,
  target: "node20",
  splitting: false
});
