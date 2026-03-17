import { rm } from "node:fs/promises";

await Promise.all([
  rm(new URL("../packages/core/dist", import.meta.url), { force: true, recursive: true }),
  rm(new URL("../packages/cli/dist", import.meta.url), { force: true, recursive: true })
]);
