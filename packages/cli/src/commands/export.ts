import { writeFile } from "node:fs/promises";

import { Command } from "commander";

import { composeFromTraitIds, renderByFormat } from "../utils/registry.js";

function collectValues(value: string, previous: string[] = []): string[] {
  return [...previous, value];
}

export function createExportCommand(): Command {
  const command = new Command("export")
    .description("Export a composed identity as markdown, JSON, or YAML.")
    .requiredOption("-t, --trait <trait-id>", "Trait id to include", collectValues)
    .requiredOption("-n, --name <name>", "Agent name")
    .requiredOption("-s, --summary <summary>", "Agent summary")
    .option("-c, --character <character>", "Character or persona name")
    .option("-q, --quote <quote>", "Quote to embed", collectValues)
    .option("-a, --avatar <avatar>", "Avatar URL or descriptor")
    .option("-f, --format <format>", "Output format: md, json, yaml", "md")
    .option("-o, --out <path>", "Write output to a file instead of stdout")
    .action(
      async (options: {
        trait: string[];
        name: string;
        summary: string;
        character?: string;
        quote?: string[];
        avatar?: string;
        format: "md" | "json" | "yaml";
        out?: string;
      }) => {
        const identity = {
          agentName: options.name,
          summary: options.summary,
          quotes: options.quote ?? []
        } as const;
        const result = await composeFromTraitIds(options.trait, {
          ...identity,
          ...(options.character ? { characterName: options.character } : {}),
          ...(options.avatar ? { avatar: options.avatar } : {})
        });
        const rendered = renderByFormat(result, options.format);

        if (options.out) {
          await writeFile(options.out, `${rendered}\n`, "utf8");
          process.stdout.write(`Wrote ${options.out}\n`);
          return;
        }

        process.stdout.write(`${rendered}\n`);
      }
    );

  command.addHelpText(
    "after",
    `
Examples:
  composer export --trait cli-engineering --trait test-first --trait meticulous-erudite --trait structured-output --trait autonomous --name Bob --summary "CLI specialist"
  composer export --trait deep-research --trait evidence-graded --trait curious-rigorous --trait structured-output --trait autonomous --name Frink --summary "Evidence-led researcher" --format yaml
`
  );

  return command;
}
