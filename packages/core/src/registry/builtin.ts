import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolve the built-in registry directory for workspace and packaged usage.
 */
export function resolveBuiltinRegistryPath(): string {
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(moduleDirectory, "../../../../registry");
}
