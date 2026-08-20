// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';

import lilypond from 'astro-lilypond';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: "https://angelcube.dev",

  redirects: {
      '/projects.html': '/projects',
      '/contact.html': '/contact'
    },

  integrations: [mdx(), react(), lilypond()],
  adapter: netlify()
});