import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const journal = defineCollection({
    loader: glob({ base: "./content/journal", pattern: "**/*.{md,mdx}" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(["Writings", "Ramblings"]),
        written_date: z.string().transform((value) => Temporal.PlainDate.from(value)),
        updated_date: z.string().transform((value) => Temporal.PlainDate.from(value)),
    }),
})

export const collections = { journal }
