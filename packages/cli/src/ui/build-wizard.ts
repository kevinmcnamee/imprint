import { checkbox, input, select } from "@inquirer/prompts";
import type { IdentityLayer, RegistryData, TraitCard, TraitDimension } from "@mainline/composer";

const dimensions: readonly TraitDimension[] = [
  "functional",
  "domain",
  "methodology",
  "personality",
  "communication",
  "supervision",
  "toolkit"
];

function traitsForDimension(registry: RegistryData, dimension: TraitDimension): readonly TraitCard[] {
  return registry.traits.filter((trait) => trait.dimension === dimension);
}

/**
 * Prompt for an identity layer and trait selection.
 */
export async function runBuildWizard(
  registry: RegistryData
): Promise<{ identity: IdentityLayer; traitIds: string[] }> {
  const agentName = await input({
    message: "Agent name",
    validate: (value) => (value.trim() ? true : "Agent name is required")
  });
  const summary = await input({
    message: "One-line summary",
    validate: (value) => (value.trim() ? true : "Summary is required")
  });
  const characterName = await input({
    message: "Character or persona name (optional)"
  });
  const quotesRaw = await input({
    message: "Comma-separated quote list (optional)"
  });
  const avatar = await input({
    message: "Avatar URL or descriptor (optional)"
  });

  const traitIds: string[] = [];
  for (const dimension of dimensions) {
    const choices = traitsForDimension(registry, dimension).map((trait) => ({
      name: `${trait.name} (${trait.id})`,
      value: trait.id,
      description: trait.description
    }));

    const isSingle = ["functional", "personality", "communication", "supervision"].includes(dimension);
    if (isSingle) {
      const selected = await select({
        message: `Select ${dimension} trait`,
        choices
      });
      traitIds.push(selected);
      continue;
    }

    const selected = await checkbox({
      message: `Select ${dimension} traits`,
      choices
    });
    traitIds.push(...selected);
  }

  const identity: {
    agentName: string;
    summary: string;
    quotes: string[];
    characterName?: string;
    avatar?: string;
  } = {
    agentName,
    summary,
    quotes: quotesRaw
      .split(",")
      .map((quote) => quote.trim())
      .filter(Boolean)
  };

  const normalizedCharacterName = characterName.trim();
  if (normalizedCharacterName) {
    identity.characterName = normalizedCharacterName;
  }

  const normalizedAvatar = avatar.trim();
  if (normalizedAvatar) {
    identity.avatar = normalizedAvatar;
  }

  return { identity, traitIds };
}
