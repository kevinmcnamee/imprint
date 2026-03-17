import { Command } from "commander";

import type { TraitCard, TraitDimension } from "@imprint/core";

import { browseRegistry } from "../utils/registry.js";

export function createBrowseCommand(): Command {
  const command = new Command("browse")
    .description("Explore the loaded trait registry.")
    .option("-d, --dimension <dimension>", "Filter by trait dimension")
    .option("-s, --search <term>", "Search trait names, ids, descriptions, and tags")
    .option("--tag <tag...>", "Filter by tags")
    .action(async (options: { dimension?: TraitDimension; search?: string; tag?: string[] }) => {
      const query: { dimension?: TraitDimension; search?: string; tags?: readonly string[] } = {};
      if (options.dimension) {
        query.dimension = options.dimension;
      }
      if (options.search) {
        query.search = options.search;
      }
      if (options.tag?.length) {
        query.tags = options.tag;
      }

      const traits = await browseRegistry(query);

      if (traits.length === 0) {
        process.stdout.write("No traits matched the current filters.\n");
        process.exitCode = 1;
        return;
      }

      process.stdout.write(
        `${traits
          .map(
            (trait: TraitCard) =>
              `${trait.id}\n  dimension: ${trait.dimension}\n  name: ${trait.name}\n  description: ${trait.description}\n`
          )
          .join("\n")}\n`
      );
    });

  command.addHelpText(
    "after",
    `
Examples:
  imprint browse
  imprint browse --dimension methodology
  imprint browse --search research --tag evidence
`
  );

  return command;
}
