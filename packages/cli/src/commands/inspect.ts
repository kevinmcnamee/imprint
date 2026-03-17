import YAML from "yaml";
import { Command } from "commander";

import { inspectTrait } from "../utils/registry.js";

export function createInspectCommand(): Command {
  const command = new Command("inspect")
    .description("Show the full trait card for a specific trait id.")
    .argument("<trait-id>", "Trait id to inspect")
    .action(async (traitId: string) => {
      const trait = await inspectTrait(traitId);
      if (!trait) {
        process.stderr.write(`Unknown trait id: ${traitId}\n`);
        process.exitCode = 1;
        return;
      }

      process.stdout.write(YAML.stringify(trait));
    });

  command.addHelpText(
    "after",
    `
Examples:
  imprint inspect cli-engineering
  imprint inspect evidence-graded
`
  );

  return command;
}
