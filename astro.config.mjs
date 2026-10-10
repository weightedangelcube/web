import { Temporal } from "temporal-polyfill";
globalThis.Temporal ??= Temporal;

// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import lilypond from 'astro-lilypond';

import preact from '@astrojs/preact';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    site: "https://angelcube.dev",
    integrations: [mdx(), lilypond(), preact()],
    adapter: cloudflare({
        prerenderEnvironment: "node",
    }),
})