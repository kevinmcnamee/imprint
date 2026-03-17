#!/usr/bin/env node
import { Command } from "commander";

import { createBrowseCommand } from "./commands/browse.js";
import { createBuildCommand } from "./commands/build.js";
import { createExportCommand } from "./commands/export.js";
import { createInspectCommand } from "./commands/inspect.js";
import { createRegistryCommand } from "./commands/registry.js";
import { createValidateCommand } from "./commands/validate.js";

/**
 * Create the top-level Commander program.
 */
export function createProgram(): Command {
  const program = new Command();

  program
    .name("imprint")
    .description("Build agent identities from modular trait cards with Imprint.")
    .version("0.1.0")
    .showHelpAfterError()
    .addCommand(createBuildCommand())
    .addCommand(createBrowseCommand())
    .addCommand(createValidateCommand())
    .addCommand(createExportCommand())
    .addCommand(createRegistryCommand())
    .addCommand(createInspectCommand())
    .addHelpText(
      "after",
      `
Quick start:
  imprint build
  imprint browse --dimension functional
  imprint export --trait cli-engineering --trait test-first --trait plan-before-build --trait meticulous-erudite --trait structured-output --trait autonomous --name Bob --summary "CLI engineering specialist"
`
    );

  return program;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await createProgram().parseAsync(process.argv);
}
