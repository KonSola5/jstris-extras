import { defineConfig } from 'wxt';
import {resolve} from 'node:path'

// See https://wxt.dev/api/config.html
export default defineConfig({
  alias: {
    "$": resolve("src/entrypoints/je-modules"),
    "jstris-extras": resolve("src/entrypoints/jstris-extras.js")
  },
  srcDir: 'src',
  extensionApi: 'webextension-polyfill',
  manifest: {
    version: "3",
    action: {
      default_title: 'Jstris Extras',
    },
    permissions: ['storage'],
    web_accessible_resources: [
      {
        matches: ['*://*.jstris.jezevec10.com/*'],
        resources: ['icon/*.png', "jstris-extras.js", "jstris-extras/*"],
      },
    ],
  },
});
