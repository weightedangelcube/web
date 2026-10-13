import { Temporal } from "temporal-polyfill"

globalThis.Temporal ??= Temporal

import cloudflare from "@astrojs/cloudflare"

import mdx from "@astrojs/mdx"
import preact from "@astrojs/preact"
// @ts-check
import { defineConfig } from "astro/config"
import lilypond from "astro-lilypond"

// https://astro.build/config
export default defineConfig({
	site: "https://angelcube.dev",
	integrations: [mdx(), lilypond(), preact()],
	adapter: cloudflare({
		prerenderEnvironment: "node"
	})
})
