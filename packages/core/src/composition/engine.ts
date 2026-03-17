import {
  type BaseLayer,
  type CompatibilityIssue,
  type ComposeRequest,
  type CompositionResult,
  type LimitViolation,
  type TraitCard,
  type TraitConflict,
  traitDimensions
} from "../types.js";
import { RegistryManager } from "../registry/manager.js";
import { defaultBaseLayer } from "../templates/base-layer.js";
import { uniqueStrings } from "../utils/collection.js";

const dimensionLimits = {
  communication: { min: 1, max: 1, recommendedMax: 1 },
  domain: { min: 0, max: 2, recommendedMax: 2 },
  functional: { min: 1, max: 2, recommendedMax: 1 },
  methodology: { min: 1, max: 4, recommendedMax: 3 },
  personality: { min: 1, max: 1, recommendedMax: 1 },
  supervision: { min: 1, max: 1, recommendedMax: 1 },
  toolkit: { min: 0, max: 2, recommendedMax: 2 }
} as const;

function resolveSelectedTraits(request: ComposeRequest): TraitCard[] {
  const byId = new Map(request.registry.traits.map((trait) => [trait.id, trait] as const));
  return request.traitIds.map((traitId) => {
    const trait = byId.get(traitId);
    if (!trait) {
      throw new Error(`Unknown trait id: ${traitId}`);
    }
    return trait;
  });
}

function collectLimitViolations(traits: readonly TraitCard[]): LimitViolation[] {
  return traitDimensions.flatMap((dimension) => {
    const selected = traits.filter((trait) => trait.dimension === dimension).length;
    const limit = dimensionLimits[dimension];

    if (selected > limit.max) {
      return [
        {
          dimension,
          selected,
          max: limit.max,
          message: `${dimension} allows at most ${limit.max} trait${limit.max === 1 ? "" : "s"}.`
        }
      ];
    }

    if (selected < limit.min) {
      return [
        {
          dimension,
          selected,
          max: limit.max,
          message: `${dimension} requires at least ${limit.min} trait${limit.min === 1 ? "" : "s"}.`
        }
      ];
    }

    return [];
  });
}

function collectConflicts(traits: readonly TraitCard[]): TraitConflict[] {
  const selectedIds = new Set(traits.map((trait) => trait.id));
  return traits.flatMap((trait) =>
    trait.conflicts_with.filter((conflict) => selectedIds.has(conflict.id)).map((conflict) => ({
      id: `${trait.id}::${conflict.id}`,
      severity: conflict.severity,
      reason: `${trait.id} conflicts with ${conflict.id}: ${conflict.reason}`
    }))
  );
}

function synthesizePersonality(traits: readonly TraitCard[]): string {
  const personality = traits.find((trait) => trait.dimension === "personality");
  const communication = traits.find((trait) => trait.dimension === "communication");
  const supervision = traits.find((trait) => trait.dimension === "supervision");
  const methodology = traits
    .filter((trait) => trait.dimension === "methodology")
    .map((trait) => trait.name)
    .join(", ");

  return [
    personality ? `${personality.name} voice` : "Neutral voice",
    communication ? `communicates with ${communication.name.toLocaleLowerCase()}` : "",
    supervision ? `operates with ${supervision.name.toLocaleLowerCase()} supervision` : "",
    methodology ? `and leans on ${methodology}.` : "."
  ]
    .filter(Boolean)
    .join(" ");
}

function buildDimensionSummary(traits: readonly TraitCard[]): CompositionResult["dimensionSummary"] {
  return {
    communication: traits.filter((trait) => trait.dimension === "communication").map((trait) => trait.id),
    domain: traits.filter((trait) => trait.dimension === "domain").map((trait) => trait.id),
    functional: traits.filter((trait) => trait.dimension === "functional").map((trait) => trait.id),
    methodology: traits.filter((trait) => trait.dimension === "methodology").map((trait) => trait.id),
    personality: traits.filter((trait) => trait.dimension === "personality").map((trait) => trait.id),
    supervision: traits.filter((trait) => trait.dimension === "supervision").map((trait) => trait.id),
    toolkit: traits.filter((trait) => trait.dimension === "toolkit").map((trait) => trait.id)
  };
}

/**
 * Compose a new agent identity from selected traits.
 */
export function composeTraits(request: ComposeRequest): CompositionResult {
  const traits = resolveSelectedTraits(request);
  const conflicts = collectConflicts(traits);
  const limitViolations = collectLimitViolations(traits);
  const registryManager = new RegistryManager(request.registry);
  const compatibilityWarnings = registryManager.detectCompatibilityIssues(traits);
  const mergedWarnings: readonly CompatibilityIssue[] = compatibilityWarnings;
  const hardConflicts = conflicts.filter((conflict) => conflict.severity === "hard");

  if (hardConflicts.length > 0) {
    throw new Error(
      `Hard conflicts prevent composition:\n${hardConflicts.map((conflict) => `- ${conflict.reason}`).join("\n")}`
    );
  }

  const baseLayer: BaseLayer = request.baseLayer ?? defaultBaseLayer;

  return {
    identity: request.identity,
    baseLayer,
    traits,
    strengths: uniqueStrings(traits.flatMap((trait) => trait.strengths)),
    conventions: uniqueStrings([...baseLayer.conventions, ...traits.flatMap((trait) => trait.conventions)]),
    tools: uniqueStrings(traits.flatMap((trait) => trait.tools)),
    conflicts,
    warnings: mergedWarnings,
    limitViolations,
    personalitySummary: synthesizePersonality(traits),
    dimensionSummary: buildDimensionSummary(traits)
  };
}
