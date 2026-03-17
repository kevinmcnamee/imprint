import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";

import { traitCardSchema } from "../schemas.js";
import type { RegistryData, RegistrySource, TraitCard, TraitDimension } from "../types.js";

function normalizeCompatibilityMap(
  input: Record<string, string[] | undefined>
): TraitCard["compatible_with"] {
  const output: TraitCard["compatible_with"] = {};
  for (const [dimension, ids] of Object.entries(input)) {
    if (ids) {
      output[dimension as TraitDimension] = ids;
    }
  }
  return output;
}

async function readTraitFile(filePath: string): Promise<TraitCard> {
  const raw = await readFile(filePath, "utf8");
  const parsed = YAML.parse(raw) as unknown;
  const trait = traitCardSchema.parse(parsed);
  const normalizedBase = {
    id: trait.id,
    dimension: trait.dimension,
    name: trait.name,
    version: trait.version,
    description: trait.description,
    author: trait.author,
    strengths: trait.strengths,
    conventions: trait.conventions,
    tools: trait.tools,
    compatible_with: normalizeCompatibilityMap(trait.compatible_with),
    conflicts_with: trait.conflicts_with,
    tags: trait.tags
  };

  return trait.notes ? { ...normalizedBase, notes: trait.notes } : normalizedBase;
}

async function collectYamlFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectYamlFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith(".yaml") || entry.name.endsWith(".yml"))) {
      results.push(fullPath);
    }
  }

  return results.sort((left, right) => left.localeCompare(right));
}

/**
 * Load a single registry source from a directory on disk.
 */
export async function loadRegistrySource(source: RegistrySource): Promise<TraitCard[]> {
  const directoryStats = await stat(source.path);
  if (!directoryStats.isDirectory()) {
    throw new Error(`Registry source path is not a directory: ${source.path}`);
  }

  const files = await collectYamlFiles(source.path);
  return Promise.all(files.map((filePath) => readTraitFile(filePath)));
}

/**
 * Load and merge multiple registry sources, keeping the first copy of each trait id.
 */
export async function loadRegistry(sources: readonly RegistrySource[]): Promise<RegistryData> {
  const traitMap = new Map<string, TraitCard>();

  for (const source of sources) {
    const traits = await loadRegistrySource(source);
    for (const trait of traits) {
      if (!traitMap.has(trait.id)) {
        traitMap.set(trait.id, trait);
      }
    }
  }

  const sortedTraits = [...traitMap.values()].sort((left, right) => {
    if (left.dimension === right.dimension) {
      return left.id.localeCompare(right.id);
    }
    return left.dimension.localeCompare(right.dimension);
  });

  return { sources, traits: sortedTraits };
}

/**
 * Group traits by dimension.
 */
export function groupTraitsByDimension(traits: readonly TraitCard[]): Record<TraitDimension, TraitCard[]> {
  return {
    communication: traits.filter((trait) => trait.dimension === "communication"),
    domain: traits.filter((trait) => trait.dimension === "domain"),
    functional: traits.filter((trait) => trait.dimension === "functional"),
    methodology: traits.filter((trait) => trait.dimension === "methodology"),
    personality: traits.filter((trait) => trait.dimension === "personality"),
    supervision: traits.filter((trait) => trait.dimension === "supervision"),
    toolkit: traits.filter((trait) => trait.dimension === "toolkit")
  };
}
