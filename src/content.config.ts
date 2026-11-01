import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const topics = [
  'Backend Engineering',
  'DevOps & Infrastructure',
  'Agentic AI',
  'Security Engineering',
  'Architecture & Systems Design',
  'Developer Tools',
  'Technical Learning Notes',
] as const;

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Public URL slug. Frozen to the slug the MkDocs site generated; never change it.
    slug: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topic: z.enum(topics),
    kind: z.enum(['article', 'learning-note']),
    source: z.object({ name: z.string(), url: z.url() }).optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Translated card text for /tr/ and /de/. The case study body itself stays in English.
const projectL10n = z.object({ summary: z.string(), problem: z.string(), status: z.string(), demonstrates: z.array(z.string()) });

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    disciplines: z.array(z.enum(['Autonomous AI', 'Backend & Infrastructure', 'Security & Tools', 'Applied Research'])),
    stack: z.array(z.string()),
    status: z.string(),
    problem: z.string(),
    repo: z.url().optional(),
    site: z.url().optional(),
    package: z.object({ name: z.string(), url: z.url() }).optional(),
    measured: z.coerce.date().transform((d) => d.toISOString().slice(0, 10)).optional(),
    facts: z.array(z.string()).default([]),
    // Engineering skills the project gives evidence for (shown on cards).
    demonstrates: z.array(z.string()),
    l10n: z.object({ tr: projectL10n, de: projectL10n }),
  }),
});

const researchL10n = z.object({ title: z.string(), description: z.string() });

const research = defineCollection({
  loader: glob({ base: './src/content/research', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Honest epistemic label shown on every entry.
    type: z.enum(['Engineering Note', 'Architecture Study', 'Research Experiment', 'Build Log']),
    status: z.enum(['Hypothesis', 'In progress', 'Observation', 'Concluded']),
    project: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Translated title/summary for TR/DE listings; the entry itself stays in English.
    l10n: z.object({ tr: researchL10n, de: researchL10n }),
  }),
});

export const collections = { writing, projects, research };
