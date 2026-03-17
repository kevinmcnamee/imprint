import { Command } from "commander";

import { addRegistryPath, loadCliConfig, removeRegistryPath } from "../utils/config.js";

export function createRegistryCommand(): Command {
  const command = new Command("registry").description("Manage additional local trait registry sources.");

  command
    .command("list")
    .description("List configured local registries.")
    .action(async () => {
      const config = await loadCliConfig();
      if (config.registries.length === 0) {
        process.stdout.write("No local registries configured.\n");
        return;
      }

      process.stdout.write(`${config.registries.map((entry) => `- ${entry}`).join("\n")}\n`);
    });

  command
    .command("add")
    .description("Add a local registry path.")
    .argument("<path>", "Path to the registry directory")
    .action(async (registryPath: string) => {
      const config = await addRegistryPath(registryPath);
      process.stdout.write(`Configured ${config.registries.length} local registries.\n`);
    });

  command
    .command("remove")
    .description("Remove a local registry path.")
    .argument("<path>", "Path to remove")
    .action(async (registryPath: string) => {
      const config = await removeRegistryPath(registryPath);
      process.stdout.write(`Configured ${config.registries.length} local registries.\n`);
    });

  command.addHelpText(
    "after",
    `
Examples:
  composer registry list
  composer registry add ./my-traits
  composer registry remove ./my-traits
`
  );

  return command;
}
