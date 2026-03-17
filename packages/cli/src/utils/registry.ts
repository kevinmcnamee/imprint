import path from "node:path";

import {
  RegistryManager,
  composeTraits,
  loadRegistry,
  renderAgentMarkdown,
  renderCompositionJson,
  renderCompositionYaml,
  resolveBuiltinRegistryPath,
  type CompositionResult,
  type IdentityLayer,
  type RegistryData,
  type RegistrySource,
  type TraitDimension,
  validateAgentFile
} from "@imprint/core";

import { loadCliConfig } from "./config.js";

export async function loadActiveRegistry(): Promise<RegistryData> {
  const cliConfig = await loadCliConfig();
  const sources: RegistrySource[] = [
    {
      id: "builtin",
      kind: "builtin",
      path: resolveBuiltinRegistryPath()
    },
    ...cliConfig.registries.map((registryPath, index) => ({
      id: `local-${index + 1}`,
      kind: "local" as const,
      path: path.resolve(registryPath)
    }))
  ];

  return loadRegistry(sources);
}

export async function composeFromTraitIds(
  traitIds: readonly string[],
  identity: IdentityLayer
): Promise<CompositionResult> {
  const registry = await loadActiveRegistry();
  return composeTraits({ traitIds, identity, registry });
}

export function renderByFormat(result: CompositionResult, format: "md" | "json" | "yaml"): string {
  switch (format) {
    case "json":
      return renderCompositionJson(result);
    case "yaml":
      return renderCompositionYaml(result);
    case "md":
    default:
      return renderAgentMarkdown(result);
  }
}

export async function validatePath(targetPath: string) {
  const registry = await loadActiveRegistry();
  return validateAgentFile(targetPath, registry);
}

export async function browseRegistry(query: {
  readonly dimension?: TraitDimension;
  readonly search?: string;
  readonly tags?: readonly string[];
}) {
  const registry = await loadActiveRegistry();
  return new RegistryManager(registry).browse(query);
}

export async function inspectTrait(traitId: string) {
  const registry = await loadActiveRegistry();
  return new RegistryManager(registry).get(traitId);
}
