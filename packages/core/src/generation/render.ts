import YAML from "yaml";

import type { CompositionResult } from "../types.js";

function metadataBlock(result: CompositionResult): string {
  const payload = {
    agentName: result.identity.agentName,
    traitIds: result.traits.map((trait) => trait.id),
    generatedBy: "agent-composer",
    version: "0.1.0"
  };

  return `<!-- agent-composer:metadata\n${JSON.stringify(payload, null, 2)}\n-->`;
}

/**
 * Render a composition as an AGENT.md document.
 */
export function renderAgentMarkdown(result: CompositionResult): string {
  const quotesSection = result.identity.quotes.length
    ? `\n## Quotes\n\n${result.identity.quotes.map((quote) => `> ${quote}`).join("\n\n")}\n`
    : "";
  const notesSection = result.traits
    .filter((trait) => trait.notes)
    .map((trait) => `- **${trait.name}:** ${trait.notes}`)
    .join("\n");
  const warningsSection = result.warnings.length
    ? `\n## Composition Warnings\n\n${result.warnings.map((warning) => `- ${warning.message}`).join("\n")}\n`
    : "";
  const limitSection = result.limitViolations.length
    ? `\n## Cardinality Notes\n\n${result.limitViolations.map((violation) => `- ${violation.message}`).join("\n")}\n`
    : "";

  return `# ${result.identity.agentName}

_${result.identity.summary}_

${metadataBlock(result)}

## Identity Layer

- **Agent Name:** ${result.identity.agentName}
- **Character:** ${result.identity.characterName ?? "Original"}
- **Voice Summary:** ${result.personalitySummary}
${result.identity.avatar ? `- **Avatar:** ${result.identity.avatar}` : ""}

${quotesSection}
## Base Layer

${result.baseLayer.summary}

### Conventions

${result.baseLayer.conventions.map((item) => `- ${item}`).join("\n")}

### Workflow

${result.baseLayer.workflow.map((item) => `- ${item}`).join("\n")}

## Trait Layer

${result.traits.map((trait) => `- **${trait.dimension}:** ${trait.name} (\`${trait.id}\`)`).join("\n")}

## Strengths

${result.strengths.map((strength) => `- ${strength}`).join("\n")}

## Conventions

${result.conventions.map((convention) => `- ${convention}`).join("\n")}

## Tools

${result.tools.map((tool) => `- ${tool}`).join("\n")}

## Trait Notes

${notesSection || "- None"}

${warningsSection}${limitSection}`.trimEnd();
}

/**
 * Render a composition as pretty-printed JSON.
 */
export function renderCompositionJson(result: CompositionResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Render a composition as YAML.
 */
export function renderCompositionYaml(result: CompositionResult): string {
  return YAML.stringify(JSON.parse(renderCompositionJson(result)));
}
