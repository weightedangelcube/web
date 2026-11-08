import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { defineCollection } from "astro:content"
import { Temporal } from "temporal-polyfill"

const logbook = defineCollection({
	loader: glob({ base: "./content/logbook", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) => {
		const base = z.object({
			title: z.string(),
			collection: z.string().optional(),
			description: z.string().optional(),
			published_date: z.string().transform((value) => Temporal.PlainDate.from(value)),
			updated_date: z.string().transform((value) => Temporal.PlainDate.from(value))
		})

		return z.discriminatedUnion("type", [
			base.extend({
				type: z.literal("text")
			}),
			base.extend({
				type: z.literal("artwork"),
				image: image(),
				alt: z.string()
			})
		])
	}
})

const bulletin = defineCollection({
	loader: glob({ base: "./content/bulletin", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		collection: z.string().optional(),
		published_date: z.string().transform((value) => Temporal.PlainDate.from(value)),
		updated_date: z.string().transform((value) => Temporal.PlainDate.from(value))
	})
})

export const collections = { logbook, bulletin }
