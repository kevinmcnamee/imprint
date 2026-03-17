import { writeFile } from "node:fs/promises";

import { Command } from "commander";
import ora from "ora";

import { composeTraits, renderAgentMarkdown } from "@imprint/core";

import { runBuildWizard } from "../ui/build-wizard.js";
import { loadActiveRegistry } from "../utils/registry.js";

export function createBuildCommand(): Command {
  const command = new Command("build")
    .description("Interactively compose a new AGENT.md from trait cards.")
    .option("-o, --out <path>", "Output path", "AGENT.md")
    .action(async (options: { out: string }) => {
      const spinner = ora("Loading registry").start();
      const registry = await loadActiveRegistry();
      spinner.text = "Collecting composition inputs";
      const { identity, traitIds } = await runBuildWizard(registry);
      spinner.text = "Composing agent";
      const result = composeTraits({ traitIds, identity, registry });
      spinner.text = "Writing AGENT.md";
      await writeFile(options.out, `${renderAgentMarkdown(result)}\n`, "utf8");
      spinner.succeed(`Wrote ${options.out}`);
    });

  command.addHelpText(
    "after",
    `
Examples:
  imprint build
  imprint build --out ./agents/bob/AGENT.md
`
  );

  return command;
}
