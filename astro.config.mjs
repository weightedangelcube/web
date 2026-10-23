import { Temporal } from "temporal-polyfill"

globalThis.Temporal ??= Temporal

import cloudflare from "@astrojs/cloudflare"

import mdx from "@astrojs/mdx"
import preact from "@astrojs/preact"
// @ts-check
import lilypond from "astro-lilypond"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
	site: "https://angelcube.dev",
	integrations: [mdx(), lilypond(), preact()],
	adapter: cloudflare({
		prerenderEnvironment: "node"
	})
})
