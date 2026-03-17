import type {
  CompatibilityIssue,
  RegistryData,
  RegistryQuery,
  TraitCard,
  TraitDimension
} from "../types.js";
import { includesText } from "../utils/collection.js";

/**
 * Registry manager with browse, inspect, and compatibility helpers.
 */
export class RegistryManager {
  public constructor(private readonly registry: RegistryData) {}

  /**
   * Return every loaded trait card.
   */
  public list(): readonly TraitCard[] {
    return this.registry.traits;
  }

  /**
   * Find a trait by id.
   */
  public get(id: string): TraitCard | undefined {
    return this.registry.traits.find((trait) => trait.id === id);
  }

  /**
   * Browse traits with optional dimension, search, and tag filters.
   */
  public browse(query: RegistryQuery = {}): readonly TraitCard[] {
    return this.registry.traits.filter((trait) => {
      const dimensionMatch = query.dimension ? trait.dimension === query.dimension : true;
      const searchMatch = query.search
        ? [
            trait.id,
            trait.name,
            trait.description,
            ...trait.tags,
            ...trait.strengths,
            ...trait.tools
          ].some((candidate) => includesText(candidate, query.search ?? ""))
        : true;
      const tagsMatch = query.tags?.length
        ? query.tags.every((tag) => trait.tags.includes(tag))
        : true;

      return dimensionMatch && searchMatch && tagsMatch;
    });
  }

  /**
   * List traits compatible with a given trait in a target dimension.
   */
  public listCompatibleTraits(id: string, dimension?: TraitDimension): readonly TraitCard[] {
    const trait = this.get(id);
    if (!trait) {
      return [];
    }

    const allowedIds = dimension
      ? trait.compatible_with[dimension] ?? []
      : Object.values(trait.compatible_with).flat();

    return this.registry.traits.filter((candidate) => allowedIds.includes(candidate.id));
  }

  /**
   * Detect compatibility gaps where a selected trait excludes another trait in the same request.
   */
  public detectCompatibilityIssues(selectedTraits: readonly TraitCard[]): readonly CompatibilityIssue[] {
    const issues: CompatibilityIssue[] = [];

    for (let index = 0; index < selectedTraits.length; index += 1) {
      const trait = selectedTraits[index];
      if (!trait) {
        continue;
      }

      for (let candidateIndex = index + 1; candidateIndex < selectedTraits.length; candidateIndex += 1) {
        const candidate = selectedTraits[candidateIndex];
        if (!candidate || candidate.dimension === trait.dimension) {
          continue;
        }

        const traitPreferences = trait.compatible_with[candidate.dimension];
        const candidatePreferences = candidate.compatible_with[trait.dimension];
        const hasExplicitPairingMetadata =
          Boolean(traitPreferences?.length) && Boolean(candidatePreferences?.length);

        if (!hasExplicitPairingMetadata) {
          continue;
        }

        const traitAllowsCandidate = traitPreferences?.includes(candidate.id) ?? false;
        const candidateAllowsTrait = candidatePreferences?.includes(trait.id) ?? false;

        if (!traitAllowsCandidate && !candidateAllowsTrait) {
          issues.push({
            sourceTraitId: trait.id,
            targetTraitId: candidate.id,
            dimension: candidate.dimension,
            message: `${trait.id} and ${candidate.id} do not explicitly prefer each other across ${trait.dimension}/${candidate.dimension}.`
          });
        }
      }
    }

    return issues;
  }
}
