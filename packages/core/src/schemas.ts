import { z } from "zod";

import { traitDimensions } from "./types.js";

export const traitDimensionSchema = z.enum(traitDimensions);

export const traitConflictSchema = z.object({
  id: z.string().min(1),
  severity: z.enum(["hard", "soft"]),
  reason: z.string().min(1)
});

export const compatibilityMapSchema = z
  .object({
    functional: z.array(z.string()).optional(),
    domain: z.array(z.string()).optional(),
    methodology: z.array(z.string()).optional(),
    personality: z.array(z.string()).optional(),
    communication: z.array(z.string()).optional(),
    supervision: z.array(z.string()).optional(),
    toolkit: z.array(z.string()).optional()
  })
  .partial()
  .default({});

export const traitCardSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  dimension: traitDimensionSchema,
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().min(1),
  author: z.string().min(1),
  strengths: z.array(z.string().min(1)).min(1),
  conventions: z.array(z.string().min(1)).min(1),
  tools: z.array(z.string().min(1)).default([]),
  compatible_with: compatibilityMapSchema,
  conflicts_with: z.array(traitConflictSchema).default([]),
  tags: z.array(z.string().min(1)).min(1),
  notes: z.string().optional()
});
