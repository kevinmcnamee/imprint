export { composeTraits } from "./composition/engine.js";
export { renderAgentMarkdown, renderCompositionJson, renderCompositionYaml } from "./generation/render.js";
export { resolveBuiltinRegistryPath } from "./registry/builtin.js";
export { loadRegistry, loadRegistrySource, groupTraitsByDimension } from "./registry/load.js";
export { RegistryManager } from "./registry/manager.js";
export { traitCardSchema, traitDimensionSchema } from "./schemas.js";
export { defaultBaseLayer } from "./templates/base-layer.js";
export { validateAgentFile } from "./validation/validate.js";
export type {
  BaseLayer,
  CompatibilityIssue,
  ComposeRequest,
  CompositionResult,
  IdentityLayer,
  LimitViolation,
  RegistryData,
  RegistryQuery,
  RegistrySource,
  TraitCard,
  TraitConflict,
  TraitDimension,
  ValidationFinding,
  ValidationReport
} from "./types.js";
export { traitDimensions } from "./types.js";
