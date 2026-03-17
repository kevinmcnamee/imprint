import { Command } from "commander";

import { validatePath } from "../utils/registry.js";

export function createValidateCommand(): Command {
  const command = new Command("validate")
    .description("Validate an AGENT.md file against Imprint conventions and known trait ids.")
    .argument("<path>", "Path to AGENT.md")
    .action(async (targetPath: string) => {
      const report = await validatePath(targetPath);
      process.stdout.write(`valid: ${report.valid}\n`);
      for (const finding of report.findings) {
        process.stdout.write(`- [${finding.level}] ${finding.code}: ${finding.message}\n`);
      }
      process.exitCode = report.valid ? 0 : 1;
    });

  command.addHelpText(
    "after",
    `
Examples:
  imprint validate ./AGENT.md
  imprint validate ./agents/lisa/AGENT.md
`
  );

  return command;
}
