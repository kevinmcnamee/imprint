import type { BaseLayer } from "../types.js";

/**
 * Default base layer injected into every composed agent.
 */
export const defaultBaseLayer: BaseLayer = {
  title: "Base Layer",
  summary:
    "Shared conventions that every composed agent inherits before trait-specific behavior is applied.",
  conventions: [
    "Use isolated git worktrees for coding tasks and avoid modifying the primary checkout directly.",
    "Never push changes without explicit human approval.",
    "Prefer safe file removal workflows over destructive shell shortcuts.",
    "Treat output formatting, documentation quality, and reproducibility as product features.",
    "Use clear markdown output with explicit next steps, assumptions, and verification status.",
    "Avoid internal-only references, private infrastructure assumptions, or machine-specific paths in public artifacts.",
    "Document blockers, risks, and any required human review rather than silently skipping them.",
    "Respect user instructions, existing repository conventions, and the current codebase architecture."
  ],
  workflow: [
    "Read the specification and inspect the current repository state before editing.",
    "Choose the smallest coherent design that satisfies the requested outcome and remains extensible.",
    "Implement the happy path end-to-end, then cover conflict handling and validation.",
    "Run build and test commands before declaring completion."
  ]
};
