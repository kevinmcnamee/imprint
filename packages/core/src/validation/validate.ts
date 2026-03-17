import { readFile } from "node:fs/promises";

import matter from "gray-matter";

import type { RegistryData, ValidationFinding, ValidationReport } from "../types.js";

function parseMetadata(document: string): ValidationReport["metadata"] {
  const match = document.match(/<!-- [a-z-]+:metadata\s*([\s\S]*?)\s*-->/);
  if (!match) {
    return undefined;
  }

  try {
    const payload = match[1];
    if (!payload) {
      return undefined;
    }
    const metadata = JSON.parse(payload) as { agentName?: string; traitIds?: string[] };
    return metadata.agentName
      ? {
          agentName: metadata.agentName,
          traitIds: metadata.traitIds ?? []
        }
      : {
          traitIds: metadata.traitIds ?? []
        };
  } catch {
    return undefined;
  }
}

function requiredSectionsPresent(document: string): ValidationFinding[] {
  const sections = [
    "## Identity Layer",
    "## Base Layer",
    "## Trait Layer",
    "## Strengths",
    "## Conventions",
    "## Tools"
  ];

  return sections.flatMap((section) =>
    document.includes(section)
      ? []
      : [
          {
            level: "warning" as const,
            code: "missing_section",
            message: `Document does not include required section: ${section}`
          }
        ]
  );
}

/**
 * Validate an AGENT.md document against Imprint conventions and known trait ids.
 */
export async function validateAgentFile(path: string, registry?: RegistryData): Promise<ValidationReport> {
  const raw = await readFile(path, "utf8");
  const parsed = matter(raw);
  const findings: ValidationFinding[] = [];

  if (!parsed.content.trimStart().startsWith("# ")) {
    findings.push({
      level: "error",
      code: "missing_heading",
      message: "AGENT.md should start with a first-level heading."
    });
  }

  findings.push(...requiredSectionsPresent(parsed.content));

  const metadata = parseMetadata(parsed.content);
  if (!metadata) {
    findings.push({
      level: "info",
      code: "missing_metadata",
      message:
        "No Imprint metadata block found. Validation fell back to section-level heuristics only."
    });
  } else if (registry) {
    const knownTraitIds = new Set(registry.traits.map((trait) => trait.id));
    for (const traitId of metadata.traitIds) {
      if (!knownTraitIds.has(traitId)) {
        findings.push({
          level: "error",
          code: "unknown_trait",
          message: `Metadata references unknown trait id: ${traitId}`
        });
      }
    }
  }

  return metadata
    ? {
        valid: findings.every((finding) => finding.level !== "error"),
        findings,
        metadata
      }
    : {
        valid: findings.every((finding) => finding.level !== "error"),
        findings
      };
}
