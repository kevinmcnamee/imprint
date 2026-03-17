import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolve the built-in registry directory for workspace and packaged usage.
 */
export function resolveBuiltinRegistryPath(): string {
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(moduleDirectory, "../registry"),
    path.resolve(moduleDirectory, "../../registry"),
    path.resolve(process.cwd(), "registry")
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Unable to locate the built-in registry from ${moduleDirectory}.`);
}
