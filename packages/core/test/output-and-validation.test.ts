import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  composeTraits,
  loadRegistry,
  renderAgentMarkdown,
  renderCompositionJson,
  renderCompositionYaml,
  validateAgentFile
} from "../src/index.js";

const registryPath = path.resolve(process.cwd(), "registry");

describe("output generation and validation", () => {
  it("renders markdown, json, and yaml exports", async () => {
    const registry = await loadRegistry([{ id: "builtin", kind: "builtin", path: registryPath }]);
    const result = composeTraits({
      registry,
      traitIds: [
        "deep-research",
        "evidence-graded",
        "exhaustive-reading",
        "curious-rigorous",
        "structured-output",
        "autonomous"
      ],
      identity: {
        agentName: "Frink",
        summary: "Evidence-led researcher",
        quotes: ["Primary sources first."],
        skillRefs: ["claude-code/product-verification"],
        workflowRefs: ["research/source-comparison"]
      }
    });

    expect(renderAgentMarkdown(result)).toContain("## Trait Layer");
    expect(renderAgentMarkdown(result)).toContain("`claude-code/product-verification`");
    expect(renderCompositionJson(result)).toContain("\"agentName\": \"Frink\"");
    expect(renderCompositionJson(result)).toContain("\"skillRefs\": [");
    expect(renderCompositionYaml(result)).toContain("agentName: Frink");
    expect(renderCompositionYaml(result)).toContain("workflowRefs:");
  });

  it("validates generated agent markdown against known traits", async () => {
    const registry = await loadRegistry([{ id: "builtin", kind: "builtin", path: registryPath }]);
    const result = composeTraits({
      registry,
      traitIds: [
        "content-curation",
        "tech-industry",
        "document-everything",
        "curious-selective",
        "structured-output",
        "autonomous"
      ],
      identity: {
        agentName: "Lisa",
        summary: "High-signal curator",
        quotes: ["Surface what matters."]
      }
    });

    const directory = await mkdtemp(path.join(os.tmpdir(), "imprint-"));
    const filePath = path.join(directory, "AGENT.md");
    await writeFile(filePath, renderAgentMarkdown(result), "utf8");

    const report = await validateAgentFile(filePath, registry);
    expect(report.valid).toBe(true);
    expect(report.metadata?.traitIds).toContain("content-curation");
    expect(report.metadata?.skillRefs).toEqual([]);
    expect(report.metadata?.workflowRefs).toEqual([]);
  });
});
