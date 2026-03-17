import path from "node:path";

import { composeTraits, loadRegistry, renderAgentMarkdown } from "../src/index.js";

const registryPath = path.resolve(process.cwd(), "registry");

describe("known identity recomposition", () => {
  it("recomposes Bob, Ned, and Lisa into usable AGENT.md outputs", async () => {
    const registry = await loadRegistry([{ id: "builtin", kind: "builtin", path: registryPath }]);
    const examples = [
      {
        identity: {
          agentName: "Bob",
          characterName: "Sideshow Bob",
          summary: "CLI engineering specialist",
          quotes: ["Build something worthy of the terminal."]
        },
        traitIds: [
          "cli-engineering",
          "test-first",
          "plan-before-build",
          "meticulous-erudite",
          "structured-output",
          "autonomous",
          "typescript-cli"
        ]
      },
      {
        identity: {
          agentName: "Ned",
          characterName: "Ned Flanders",
          summary: "General coding agent with a strong spec and testing discipline",
          quotes: ["Tests are not optional."]
        },
        traitIds: [
          "general-coding",
          "test-first",
          "plan-before-build",
          "spec-driven",
          "methodical-cheerful",
          "structured-output",
          "checkpoint-heavy",
          "typescript-web"
        ]
      },
      {
        identity: {
          agentName: "Lisa",
          characterName: "Lisa Simpson",
          summary: "Selective curator for high-signal technology developments",
          quotes: ["Surface what matters."]
        },
        traitIds: [
          "content-curation",
          "tech-industry",
          "document-everything",
          "curious-selective",
          "structured-output",
          "autonomous"
        ]
      }
    ] as const;

    for (const example of examples) {
      const result = composeTraits({
        registry,
        traitIds: example.traitIds,
        identity: example.identity
      });
      const markdown = renderAgentMarkdown(result);
      expect(markdown).toContain(`# ${example.identity.agentName}`);
      expect(markdown).toContain("## Strengths");
      expect(markdown).toContain("## Conventions");
      expect(result.limitViolations).toHaveLength(0);
    }
  });
});
