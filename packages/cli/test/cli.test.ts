import { execa } from "execa";
import path from "node:path";

const cliEntry = path.resolve(process.cwd(), "packages/cli/src/index.ts");
const cliDistEntry = path.resolve(process.cwd(), "packages/cli/dist/index.js");

describe("cli help surface", () => {
  it("shows top-level help text", async () => {
    const result = await execa("npx", ["tsx", cliEntry, "--help"]);

    expect(result.stdout).toContain("Build agent identities from modular trait cards with Imprint.");
    expect(result.stdout).toContain("build");
    expect(result.stdout).toContain("export");
  });

  it("shows command-specific help text", async () => {
    const result = await execa("npx", ["tsx", cliEntry, "browse", "--help"]);
    expect(result.stdout).toContain("Explore the loaded trait registry.");
    expect(result.stdout).toContain("imprint browse --dimension methodology");
  });

  it("smoke tests the built dist CLI", async () => {
    await execa("npm", ["run", "build", "--workspaces"], {
      cwd: process.cwd()
    });

    const result = await execa("node", [cliDistEntry, "--help"]);
    expect(result.stdout).toContain("Build agent identities from modular trait cards with Imprint.");
    expect(result.stdout).toContain("build");
  });
});
