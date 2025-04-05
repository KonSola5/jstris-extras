import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
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
