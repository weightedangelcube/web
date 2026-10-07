import { Temporal } from "temporal-polyfill";
globalThis.Temporal ??= Temporal;

// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import lilypond from 'astro-lilypond';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: "https://angelcube.dev",

  redirects: {
      '/projects.html': '/projects',
      '/contact.html': '/contact'
    },

  integrations: [mdx(), lilypond(), preact({ compat: true })]
});