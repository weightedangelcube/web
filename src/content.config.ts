import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { Temporal } from "temporal-polyfill";

const logbook = defineCollection({
    loader: glob({ base: "./content/logbook", pattern: "**/*.{md,mdx}" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(["Writings", "Ramblings"]),
        published_date: z.string().transform((value) => Temporal.PlainDate.from(value)),
        updated_date: z.string().transform((value) => Temporal.PlainDate.from(value)),
    }),
})

export const collections = { logbook }
