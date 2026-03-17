# Contributing

Imprint is a public, library-first project. Contributions should improve the quality of generated agents, the reliability of the composition engine, or the developer experience of the CLI and package APIs.

## Development

```bash
npm install
npm run generate:registry
npm run build
npm test
```

## Project Structure

- `packages/core` contains the `@imprint/core` composition engine, registry loader, generators, and validator.
- `packages/cli` contains the `imprint` binary and command UX.
- `registry/` contains the canonical built-in trait cards.
- `scripts/` contains maintenance scripts used during development and release prep.

## Standards

- Use TypeScript in strict mode.
- Add or update tests for behavior changes, including built-artifact coverage when packaging behavior changes.
- Keep trait cards concrete, opinionated, and immediately useful.
- Preserve public, portable paths in docs and examples.
- Smoke test the built CLI with `node packages/cli/dist/index.js --help` when touching packaging or release flow.

## Pull Requests

1. Explain the user-facing behavior change.
2. Link any updated docs or trait cards.
3. Include test coverage for the new behavior.
4. Keep commits atomic and descriptive.
