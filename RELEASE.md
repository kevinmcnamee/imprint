# Imprint Release and Package Management

This document is the source of truth for how Imprint versions, tags, and publishes packages.

## Package topology

Imprint is a workspace monorepo with three package layers:

- **root** (`/package.json`) — private workspace wrapper, build/test orchestration, release coordination
- **@imprint/core** (`packages/core`) — reusable composition engine and registry access
- **imprint** (`packages/cli`) — native CLI built on top of `@imprint/core`

Current versions are intentionally kept in lockstep:
- root: `0.1.0`
- `@imprint/core`: `0.1.0`
- `imprint`: `0.1.0`

## Current packaging reality

Today, the web UI does **not** consume `@imprint/core` as an installed package. It carries its own embedded registry and composition logic.

That means:
- the CLI and core packages are the canonical packaged artifacts
- the UI is currently a sibling implementation, not a thin package consumer
- version drift between CLI/core and UI is possible and should be watched explicitly

Future direction:
- publish `@imprint/core`
- make the UI consume the shared package or a generated registry artifact instead of hand-copying logic

## Versioning policy

For now, keep all publishable packages aligned to the same semver.

When releasing:
1. bump `packages/core/package.json`
2. bump `packages/cli/package.json`
3. bump the root workspace version if we want the repo version to match the published packages
4. update any internal dependency references, especially `@imprint/core` inside `packages/cli`

Until there is a strong reason to decouple them, treat Imprint as a single release train.

## Release checklist

Before cutting a release:

```bash
git fetch origin main
git checkout main
git pull origin main
npm install
npm test
npm run build
```

Confirm:
- registry generation succeeds
- core builds cleanly
- CLI builds cleanly
- tests pass
- package versions are correct

## Tagging a release

We use git tags as the canonical release marker.

Tag format:

```bash
v0.1.0
v0.1.1
v0.2.0
```

Release flow:

```bash
git fetch origin main
git checkout main
git pull origin main
npm install
npm test
npm run build
git tag -a v0.1.0 -m "Imprint v0.1.0"
git push origin v0.1.0
```

Then create a GitHub release:

```bash
gh release create v0.1.0 \
  --title "Imprint v0.1.0" \
  --notes "First tagged release of the Imprint CLI and core packages."
```

## Publishing to npm

When npm publishing is ready, publish in this order:

1. `@imprint/core`
2. `imprint`

Example:

```bash
cd packages/core
npm publish --access public

cd ../cli
npm publish --access public
```

Notes:
- `imprint` depends on `@imprint/core`, so core must be published first
- publish only from a clean `main` state that matches the release tag
- if provenance/signing is added later, document it here and make it mandatory

## Package management rules

- Do not release from a feature branch
- Always release from the latest `origin/main`
- Do not tag from a stale local main
- Do not publish without a matching git tag
- Keep release notes short and concrete: what changed, what ships, what is still missing

## Initial stance

Right now, the lowest-friction release model is:
- git tag + GitHub release for milestone tracking
- npm publication once we are ready for external installation and support expectations

That lets us start behaving like a packaged tool immediately without pretending the whole distribution story is finished.
