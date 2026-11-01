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
  }),
});

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
  }),
});

export const collections = { writing, projects, research };
