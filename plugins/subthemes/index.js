const { path } = require('@vuepress/shared-utils');
const fs = require('fs');

module.exports = (options) =>  ({
  alias: {
    'ThemedContent': path.resolve(__dirname, "./ThemedContent.js")
  },
  extendPageData: function($page) {
    console.log("Checking for subtheme");
    if (!$page._filePath) {
      console.log("No path");
      return $page;
    }
    let vuepressPath = path.resolve(path.dirname($page._filePath), ".vuepress/theme");
    // Check if the subtheme exists
    if (!fs.existsSync(vuepressPath)) {
      console.log("No subtheme");
      return;
    }
    console.log("Subtheme "+vuepressPath);
    $page._subTheme = vuepressPath;
  }
});
