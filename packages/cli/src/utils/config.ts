import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export interface CliRegistryConfig {
  readonly registries: readonly string[];
}

const configDirectory = path.join(os.homedir(), ".agent-composer");
const configPath = path.join(configDirectory, "config.json");

async function ensureConfigDirectory(): Promise<void> {
  await mkdir(configDirectory, { recursive: true });
}

/**
 * Load the persisted CLI registry configuration.
 */
export async function loadCliConfig(): Promise<CliRegistryConfig> {
  try {
    const raw = await readFile(configPath, "utf8");
    return JSON.parse(raw) as CliRegistryConfig;
  } catch {
    return { registries: [] };
  }
}

/**
 * Persist the CLI registry configuration.
 */
export async function saveCliConfig(config: CliRegistryConfig): Promise<void> {
  await ensureConfigDirectory();
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

/**
 * Add a registry path to config if it does not already exist.
 */
export async function addRegistryPath(registryPath: string): Promise<CliRegistryConfig> {
  const config = await loadCliConfig();
  const normalized = path.resolve(registryPath);
  const registries = [...new Set([...config.registries, normalized])];
  const next = { registries };
  await saveCliConfig(next);
  return next;
}

/**
 * Remove a registry path from config.
 */
export async function removeRegistryPath(registryPath: string): Promise<CliRegistryConfig> {
  const config = await loadCliConfig();
  const normalized = path.resolve(registryPath);
  const next = {
    registries: config.registries.filter((entry) => path.resolve(entry) !== normalized)
  };
  await saveCliConfig(next);
  return next;
}
