[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

# Agent Composer

Compose durable `AGENT.md` files from modular trait cards instead of rewriting agent identities from scratch.

Agent Composer is a library-first system for building agent identities with three layers:

1. Base layer: shared conventions every agent inherits automatically.
2. Trait layer: composable behavior across seven dimensions.
3. Identity layer: name, character, quotes, and flavor applied last.

The result is a reusable engine, a CLI for building and inspecting agents, and a registry format that others can extend.

## Quick Start

```bash
npx agent-composer build
```

1. Choose one or more trait cards across the seven dimensions.
2. Enter the identity details for the agent you want to generate.
3. Save the generated `AGENT.md` and validate it with `composer validate`.

You can also export a composition non-interactively:

```bash
npx agent-composer export \
  --trait cli-engineering \
  --trait test-first \
  --trait plan-before-build \
  --trait meticulous-erudite \
  --trait structured-output \
  --trait autonomous \
  --trait typescript-cli \
  --name "Bob" \
  --summary "CLI engineering specialist"
```

## Why Composable Identities Matter

Most agent identity files collapse three different concerns into one document:

- Shared rules every agent should inherit.
- Reusable behavioral traits that many agents share.
- Persona-specific flavor and naming.

That makes reuse hard and drift inevitable. Agent Composer separates those concerns so teams can:

- Recompose known agents from a small number of tested traits.
- Build new agents without starting from a blank file.
- Apply consistent standards across many agents.
- Review trait cards independently from character flavor.

This repository ships Phase 1 of that model: a strict TypeScript engine, a public trait registry, and a CLI for composition, browsing, export, and validation.

## Architecture

```text
                      +----------------------+
                      |   Identity Layer     |
                      | name, persona, quote |
                      +----------+-----------+
                                 |
                      +----------v-----------+
                      |     Trait Layer      |
                      | 7 composable dims    |
                      +----------+-----------+
                                 |
                      +----------v-----------+
                      |     Base Layer       |
                      | shared conventions   |
                      +----------------------+
```

Repository layout:

```text
.
├── packages/
│   ├── core/          # @mainline/composer library
│   └── cli/           # agent-composer binary
├── registry/          # built-in YAML trait cards
├── scripts/           # registry generation and maintenance helpers
└── README.md
```

## Command Reference

### `composer build`

Interactive wizard for composing an `AGENT.md`.

```bash
composer build --out ./AGENT.md
```

### `composer browse`

Browse the active registry with optional filters.

```bash
composer browse
composer browse --dimension methodology
composer browse --search research --tag evidence
```

### `composer inspect <trait-id>`

Inspect a full trait card.

```bash
composer inspect cli-engineering
```

### `composer validate <path>`

Validate an `AGENT.md` for required sections and known trait ids.

```bash
composer validate ./AGENT.md
```

### `composer export`

Export a composition as markdown, JSON, or YAML.

```bash
composer export \
  --trait deep-research \
  --trait evidence-graded \
  --trait curious-rigorous \
  --trait structured-output \
  --trait autonomous \
  --name "Frink" \
  --summary "Evidence-led researcher" \
  --format yaml
```

### `composer registry list|add|remove`

Manage additional local trait registries.

```bash
composer registry list
composer registry add ./my-traits
composer registry remove ./my-traits
```

## Programmatic API

The core package is designed to be embedded in other tools.

```ts
import {
  composeTraits,
  loadRegistry,
  RegistryManager,
  renderAgentMarkdown
} from "@mainline/composer";

const registry = await loadRegistry([
  { id: "builtin", kind: "builtin", path: "./registry" }
]);

const manager = new RegistryManager(registry);
const traits = manager.browse({ dimension: "functional" });

const result = composeTraits({
  registry,
  traitIds: [
    "cli-engineering",
    "test-first",
    "plan-before-build",
    "meticulous-erudite",
    "structured-output",
    "autonomous",
    "typescript-cli"
  ],
  identity: {
    agentName: "Bob",
    summary: "CLI engineering specialist",
    quotes: ["Build something worthy of the terminal."]
  }
});

console.log(renderAgentMarkdown(result));
```

## Trait Card Format

Trait cards are YAML files stored by dimension under `registry/`.

```yaml
id: cli-engineering
dimension: functional
name: CLI Engineering
version: 1.0.0
description: Deep expertise in command-line architecture, terminal UX, and scriptable developer workflows.
author: mainline

strengths:
  - Command hierarchy design with strong subcommand ergonomics
  - Progressive disclosure for happy paths and advanced workflows

conventions:
  - Every command ships with --help and at least one concrete example
  - Error messages explain what happened, why it happened, and what to do next

tools:
  - Commander.js
  - @inquirer/prompts
  - chalk

compatible_with:
  methodology:
    - test-first
    - plan-before-build
  personality:
    - meticulous-erudite

conflicts_with: []

tags:
  - developer-tools
  - terminal
  - cli
```

Fields:

- `id`: stable slug used for composition and references.
- `dimension`: one of `functional`, `domain`, `methodology`, `personality`, `communication`, `supervision`, `toolkit`.
- `strengths`: capabilities contributed by the card.
- `conventions`: behavioral instructions merged into the output.
- `tools`: framework or tooling preferences.
- `compatible_with`: preferred pairings by dimension.
- `conflicts_with`: hard or soft conflicts with other trait ids.
- `notes`: optional author guidance used in generated output.

## Composition Rules

The engine applies these rules during composition:

- Strengths merge by union and deduplication.
- Conventions merge by union and deduplication.
- Tools merge by union and deduplication.
- Hard conflicts block composition.
- Soft conflicts are surfaced as warnings.
- Dimension limits are enforced and reported.

Default limits:

- Functional: 1 required, 2 maximum, 1 recommended.
- Domain: 0 to 2.
- Methodology: 1 to 4, 3 recommended.
- Personality: exactly 1.
- Communication: exactly 1.
- Supervision: exactly 1.
- Toolkit: 0 to 2.

## Built-In Traits

The built-in registry ships with 28 seed cards across 7 dimensions.

### Functional

- `cli-engineering`
- `general-coding`
- `content-curation`
- `deep-research`
- `critical-review`

### Domain

- `tech-industry`
- `fintech`
- `consulting`

### Methodology

- `test-first`
- `plan-before-build`
- `evidence-graded`
- `exhaustive-reading`
- `document-everything`
- `spec-driven`
- `concrete-alternatives`

### Personality

- `meticulous-erudite`
- `methodical-cheerful`
- `curious-selective`
- `curious-rigorous`
- `direct-experienced`

### Communication

- `structured-output`
- `terse-updates`

### Supervision

- `autonomous`
- `checkpoint-heavy`
- `approval-gated`

### Toolkit

- `typescript-cli`
- `typescript-web`
- `python-automation`

## Validation

Generated `AGENT.md` files include a metadata block so the validator can verify:

- Required sections exist.
- Known trait ids resolve against the active registry.
- The file still looks like a composer-generated agent document.

If metadata is absent, the validator falls back to section-level heuristics and reports that limitation.

## Contributing

Contribution guidance lives in [CONTRIBUTING.md](./CONTRIBUTING.md). In short:

- keep the public API documented,
- add tests with behavior changes,
- make trait cards concrete and reusable,
- avoid private infrastructure assumptions in docs or code.

## License

MIT. See [LICENSE](./LICENSE).
