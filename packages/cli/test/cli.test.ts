import { execa } from "execa";
import path from "node:path";

const cliEntry = path.resolve(process.cwd(), "packages/cli/src/index.ts");

describe("cli help surface", () => {
  it("shows top-level help text", async () => {
    const result = await execa("npx", ["tsx", cliEntry, "--help"]);

    expect(result.stdout).toContain("Compose agent identities from modular trait cards.");
    expect(result.stdout).toContain("build");
    expect(result.stdout).toContain("export");
  });

  it("shows command-specific help text", async () => {
    const result = await execa("npx", ["tsx", cliEntry, "browse", "--help"]);
    expect(result.stdout).toContain("Explore the loaded trait registry.");
    expect(result.stdout).toContain("composer browse --dimension methodology");
  });
});
