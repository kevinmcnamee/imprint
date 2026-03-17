import path from "node:path";

import { loadRegistry, RegistryManager, traitCardSchema } from "../src/index.js";

const registryPath = path.resolve(process.cwd(), "registry");

describe("registry loading", () => {
  it("loads and validates all seed traits", async () => {
    const registry = await loadRegistry([{ id: "builtin", kind: "builtin", path: registryPath }]);
    expect(registry.traits).toHaveLength(28);
    expect(registry.traits.every((trait) => traitCardSchema.safeParse(trait).success)).toBe(true);
  });

  it("supports browsing and compatibility lookups", async () => {
    const registry = await loadRegistry([{ id: "builtin", kind: "builtin", path: registryPath }]);
    const manager = new RegistryManager(registry);

    const methodologyTraits = manager.browse({ dimension: "methodology" });
    expect(methodologyTraits.map((trait) => trait.id)).toContain("test-first");

    const compatible = manager.listCompatibleTraits("cli-engineering", "toolkit");
    expect(compatible.map((trait) => trait.id)).toContain("typescript-cli");
  });
});
