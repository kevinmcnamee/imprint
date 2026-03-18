[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

# Imprint

_Every agent needs an imprint._

Imprint is an open-source composition system for building durable `AGENT.md` files from reusable trait cards instead of rewriting agent instructions from scratch. It combines a shared base layer, a curated trait registry, and an identity layer so teams can generate consistent agent specs, inspect the cards behind them, validate generated output, and extend the registry with their own traits.

Imprint is intentionally identity-first:
- Imprint defines who the agent is: its standards, judgment style, supervision posture, communication shape, and durable role composition.
- Skills and workflows define what the agent does: deploy flows, runbooks, verification packs, scaffolds, and other procedural modules.
- Skills are an orthogonal execution layer, not a replacement for identity. The same skill can be attached to different identities and should behave differently because the identity modulates risk tolerance, reporting style, and escalation behavior.

Project site: [imprint.getmainline.ai](https://imprint.getmainline.ai)

## Quick Start

```bash
npx imprint build
```

The interactive wizard loads the built-in registry, walks through trait selection across all seven dimensions, and writes a composed `AGENT.md`. It can also optionally annotate the generated identity with external `skillRefs` and `workflowRefs` when you want to point at procedural modules without collapsing them into trait cards.

You can also export non-interactively:

```bash
npx imprint export \
  --trait cli-engineering \
  --trait test-first \
  --trait plan-before-build \
  --trait meticulous-erudite \
  --trait structured-output \
  --trait autonomous \
  --trait typescript-cli \
  --name "Bob" \
  --summary "CLI engineering specialist" \
  --skill-ref claude-code/product-verification \
  --workflow-ref runbooks/predeploy-checklist
```

## Command Reference

### `imprint build`

Interactive composition wizard for generating `AGENT.md`.

```bash
imprint build --out ./AGENT.md
```

### `imprint browse`

Browse the registry by dimension, text query, or tags.

```bash
imprint browse
imprint browse --dimension methodology
imprint browse --search research --tag evidence
```

### `imprint inspect <trait-id>`

Inspect a single trait card as YAML.

```bash
imprint inspect cli-engineering
```

### `imprint validate <path>`

Validate a generated agent file against Imprint conventions and known trait ids.

```bash
imprint validate ./AGENT.md
```

### `imprint export`

Export a composed identity as markdown, JSON, or YAML.

```bash
imprint export \
  --trait deep-research \
  --trait evidence-graded \
  --trait curious-rigorous \
  --trait structured-output \
  --trait autonomous \
  --name "Frink" \
  --summary "Evidence-led researcher" \
  --format yaml
```

### `imprint registry list|add|remove`

Manage local registry directories alongside the built-in trait set.

```bash
imprint registry list
imprint registry add ./my-traits
imprint registry remove ./my-traits
```

## Identity vs Skills

Imprint deliberately stops at the identity layer.

1. Identity is the control plane. It captures how an agent should operate: verification standards, review posture, supervision model, communication defaults, and domain lens.
2. Skills and workflows are the execution plane. They carry procedural know-how such as CI/CD steps, runbooks, product verification loops, or infrastructure playbooks.
3. Imprint can reference those external modules through optional `skillRefs` and `workflowRefs`, but they remain metadata hooks rather than an eighth trait dimension.

This keeps the model sharp. Imprint handles composable identity. Skills and workflows remain attachable capabilities that any identity can invoke.

## Three-Layer Model

Imprint composes agents in three layers:

1. Base layer: shared operating rules every generated agent inherits.
2. Trait layer: reusable behavior selected across functional, domain, methodology, personality, communication, supervision, and toolkit dimensions.
3. Identity layer: agent-specific name, summary, character, quotes, and presentation details.

This split keeps durable conventions separate from reusable behavioral cards and persona-specific flavor, which makes agents easier to audit, reuse, and evolve.

## Trait Card Format

Trait cards are YAML documents stored under `registry/<dimension>/`.

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
  - "@inquirer/prompts"
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

notes: Treat terminal UX as product design.
```

Field summary:

- `id` is the stable slug used by the CLI and composition engine.
- `dimension` must be one of `functional`, `domain`, `methodology`, `personality`, `communication`, `supervision`, or `toolkit`.
- `strengths`, `conventions`, and `tools` contribute merged output to the composed agent.
- `compatible_with` expresses preferred pairings by dimension.
- `conflicts_with` captures hard or soft incompatibilities.
- `tags` support registry browsing and filtering.
- `notes` are optional author guidance included in generated markdown.
- `skillRefs` and `workflowRefs` are optional identity-level metadata fields on generated outputs. Use them to point at external procedural modules without turning skills into trait cards.

## Built-In Traits

Imprint ships with 35 built-in traits across 7 dimensions:

- Communication: 3
- Domain: 3
- Functional: 5
- Methodology: 12
- Personality: 5
- Supervision: 4
- Toolkit: 3

The seed registry focuses on practical, behaviorally concrete cards such as `verification-first`, `gotcha-aware`, `runbook-minded`, `adversarial-quality-bar`, `evidence-driven-operations`, `operational-risk-aware`, `incident-structured-reporting`, `cli-engineering`, `critical-review`, and `autonomous`.

## Packages

```text
.
├── packages/
│   ├── core/   # @imprint/core
│   └── cli/    # imprint
├── registry/   # canonical built-in trait source
├── scripts/    # registry generation and release helpers
└── README.md
```

## Contributing

Contribution guidelines live in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).
