/**
 * Supported trait dimensions in the composition model.
 */
export const traitDimensions = [
  "functional",
  "domain",
  "methodology",
  "personality",
  "communication",
  "supervision",
  "toolkit"
] as const;

/**
 * Trait dimension literal type.
 */
export type TraitDimension = (typeof traitDimensions)[number];

/**
 * Cardinality limit per dimension.
 */
export interface DimensionLimit {
  readonly min: number;
  readonly max: number;
  readonly recommendedMax: number;
}

/**
 * Compatibility map keyed by dimension.
 */
export type CompatibilityMap = Partial<Record<TraitDimension, string[]>>;

/**
 * Conflict severity for composition checks.
 */
export type ConflictSeverity = "hard" | "soft";

/**
 * A declared conflict between two traits.
 */
export interface TraitConflict {
  readonly id: string;
  readonly severity: ConflictSeverity;
  readonly reason: string;
}

/**
 * The author-defined trait card format loaded from YAML.
 */
export interface TraitCard {
  readonly id: string;
  readonly dimension: TraitDimension;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly author: string;
  readonly strengths: readonly string[];
  readonly conventions: readonly string[];
  readonly tools: readonly string[];
  readonly compatible_with: CompatibilityMap;
  readonly conflicts_with: readonly TraitConflict[];
  readonly tags: readonly string[];
  readonly notes?: string;
}

/**
 * Registry source description.
 */
export interface RegistrySource {
  readonly id: string;
  readonly path: string;
  readonly kind: "builtin" | "local";
}

/**
 * Loaded registry result.
 */
export interface RegistryData {
  readonly sources: readonly RegistrySource[];
  readonly traits: readonly TraitCard[];
}

/**
 * Registry browsing options.
 */
export interface RegistryQuery {
  readonly dimension?: TraitDimension;
  readonly search?: string;
  readonly tags?: readonly string[];
}

/**
 * A dimension limit violation found during composition.
 */
export interface LimitViolation {
  readonly dimension: TraitDimension;
  readonly selected: number;
  readonly max: number;
  readonly message: string;
}

/**
 * A compatibility warning between selected traits.
 */
export interface CompatibilityIssue {
  readonly sourceTraitId: string;
  readonly targetTraitId: string;
  readonly dimension: TraitDimension;
  readonly message: string;
}

/**
 * Identity layer metadata.
 */
export interface IdentityLayer {
  readonly agentName: string;
  readonly characterName?: string;
  readonly summary: string;
  readonly quotes: readonly string[];
  readonly avatar?: string;
}

/**
 * Base layer conventions injected into every output.
 */
export interface BaseLayer {
  readonly title: string;
  readonly summary: string;
  readonly conventions: readonly string[];
  readonly workflow: readonly string[];
}

/**
 * Composition request.
 */
export interface ComposeRequest {
  readonly traitIds: readonly string[];
  readonly identity: IdentityLayer;
  readonly registry: RegistryData;
  readonly baseLayer?: BaseLayer;
}

/**
 * Resolved composition metadata.
 */
export interface CompositionResult {
  readonly identity: IdentityLayer;
  readonly baseLayer: BaseLayer;
  readonly traits: readonly TraitCard[];
  readonly strengths: readonly string[];
  readonly conventions: readonly string[];
  readonly tools: readonly string[];
  readonly conflicts: readonly TraitConflict[];
  readonly warnings: readonly CompatibilityIssue[];
  readonly limitViolations: readonly LimitViolation[];
  readonly personalitySummary: string;
  readonly dimensionSummary: Readonly<Record<TraitDimension, readonly string[]>>;
}

/**
 * Exported validator findings.
 */
export interface ValidationFinding {
  readonly level: "error" | "warning" | "info";
  readonly code: string;
  readonly message: string;
}

/**
 * Validator report for an AGENT.md document.
 */
export interface ValidationReport {
  readonly valid: boolean;
  readonly findings: readonly ValidationFinding[];
  readonly metadata?: {
    readonly traitIds: readonly string[];
    readonly agentName?: string;
  };
}
