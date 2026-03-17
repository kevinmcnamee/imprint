# Contributing

Agent Composer is a public, library-first project. Contributions should improve the quality of the generated agents, the reliability of the engine, or the developer experience of integrating it.

## Development

```bash
npm install
npm run generate:registry
npm run build
npm test
```

## Project Structure

- `packages/core` contains the composition engine, registry loader, generators, and validator.
- `packages/cli` contains the `composer` binary and command UX.
- `registry/` contains the built-in trait cards.
- `scripts/` contains small maintenance scripts used during development and release prep.

## Standards

- Use TypeScript in strict mode.
- Add TSDoc for public APIs.
- Keep trait cards concrete, opinionated, and immediately useful.
- Add or update tests for any behavior change.
- Preserve public, portable paths in docs and examples.

## Pull Requests

1. Explain the user-facing behavior change.
2. Link any updated docs or trait cards.
3. Include test coverage for the new behavior.
4. Keep commits atomic and descriptive.
