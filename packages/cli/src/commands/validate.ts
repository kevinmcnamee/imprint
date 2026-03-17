import { Command } from "commander";

import { validatePath } from "../utils/registry.js";

export function createValidateCommand(): Command {
  const command = new Command("validate")
    .description("Validate an AGENT.md file against Agent Composer conventions and known trait ids.")
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
  composer validate ./AGENT.md
  composer validate ./agents/lisa/AGENT.md
`
  );

  return command;
}
