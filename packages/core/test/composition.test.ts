import path from "node:path";

import { composeTraits, loadRegistry } from "../src/index.js";

const registryPath = path.resolve(process.cwd(), "registry");

describe("composition engine", () => {
  it("merges strengths, conventions, and tools with deduplication", async () => {
    const registry = await loadRegistry([{ id: "builtin", kind: "builtin", path: registryPath }]);
    const result = composeTraits({
      registry,
      traitIds: [
        "cli-engineering",
        "test-first",
        "plan-before-build",
        "meticulous-erudite",
        "structured-output",
        "autonomous",
        "typescript-cli"
      ],
      identity: {
        agentName: "Bob",
        summary: "CLI engineering specialist",
        quotes: ["Build something worthy of the terminal."]
      }
    });

    expect(result.strengths).toContain("Command hierarchy design with strong subcommand ergonomics");
    expect(result.conventions).toContain("Every command ships with --help and at least one concrete example");
    expect(result.tools).toContain("Commander.js");
    expect(result.limitViolations).toHaveLength(0);
    expect(result.personalitySummary).toContain("Meticulous Erudite");
    expect(result.warnings).toHaveLength(0);
  });

  it("blocks hard conflicts and reports soft ones", async () => {
    const registry = await loadRegistry([{ id: "builtin", kind: "builtin", path: registryPath }]);

    expect(() =>
      composeTraits({
        registry,
        traitIds: [
          "general-coding",
          "test-first",
          "methodical-cheerful",
          "structured-output",
          "autonomous",
          "approval-gated"
        ],
        identity: {
          agentName: "Contradiction",
          summary: "Impossible supervision mix",
          quotes: []
        }
      })
    ).toThrow(/Hard conflicts prevent composition/);

    const warningResult = composeTraits({
      registry,
      traitIds: [
        "critical-review",
        "evidence-graded",
        "meticulous-erudite",
        "structured-output",
        "autonomous",
        "methodical-cheerful"
      ],
      identity: {
        agentName: "Mixed Voice",
        summary: "Soft conflict test",
        quotes: []
      }
    });

    expect(warningResult.conflicts.some((conflict) => conflict.severity === "soft")).toBe(true);
    expect(warningResult.limitViolations.some((violation) => violation.dimension === "personality")).toBe(true);
  });

  it("supports identity metadata hooks without turning skills into a trait dimension", async () => {
    const registry = await loadRegistry([{ id: "builtin", kind: "builtin", path: registryPath }]);
    const result = composeTraits({
      registry,
      traitIds: [
        "general-coding",
        "verification-first",
        "gotcha-aware",
        "runbook-minded",
        "direct-experienced",
        "structured-output",
        "operational-risk-aware"
      ],
      identity: {
        agentName: "OpsReviewer",
        summary: "Risk-aware engineer",
        quotes: [],
        skillRefs: ["claude-code/product-verification"],
        workflowRefs: ["runbooks/predeploy-checklist"]
      }
    });

    expect(result.identity.skillRefs).toContain("claude-code/product-verification");
    expect(result.identity.workflowRefs).toContain("runbooks/predeploy-checklist");
    expect(result.limitViolations).toHaveLength(0);
  });
});
