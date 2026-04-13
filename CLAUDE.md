# Imprint (agent-composer)

Composable agent identity system. Monorepo with two packages: `packages/core` (composition engine + registry) and `packages/cli` (interactive CLI).

@README.md

## Commands
- Install: `npm install`
- Build: `npm run build` (generates registry, then builds both packages)
- Test: `npm test` (requires registry generation, runs vitest)
- Typecheck: `tsc --noEmit`
- Clean: `npm run clean`
- Generate registry: `npm run generate:registry`

## Repo map
- `packages/core/src/`: composition engine, registry, schemas, templates, validation
- `packages/cli/src/`: CLI commands, interactive UI, utilities
- `scripts/`: build helpers (generate-registry, clean)
- `registry/`: trait definitions (source data for generated registry)

## Architecture
- TypeScript monorepo with npm workspaces
- Core engine is framework-agnostic, CLI consumes core
- Trait registry is generated from source files at build time
- Three composition levers: identity, skills, model/runtime
- Composition output is a structured identity file, not raw text

## Working agreement
- Start from the repo root so this file loads.
- Use an isolated git worktree for non-trivial changes.
- Run `npm run generate:registry` before testing if traits changed.
- Match existing patterns before introducing new dependencies.

## Delivery rules
- Run typecheck and tests before reporting done.
- If registry generation is needed, do it first.
- Keep the core package dependency-light.
