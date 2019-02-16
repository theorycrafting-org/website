const { path } = require('@vuepress/shared-utils');

const elasticlunr = require("elasticlunr");

var idx = elasticlunr(function() {
  this.addField("title");
  this.addField("excerpt");
  this.addField("body");
  this.setRef("url");
});
var rep = function(text) {
  if (!text) text = "";
  return text.replace(/[\b]/g, '')
  .replace(/\$.*\$/g, '')
  .replace(/[\f]/g, '')
  .replace(/[\n]/g, '<br/>')
  .replace(/[\r]/g, '')
  .replace(/[\t]/g, ' ');
}

var pages = {};
module.exports = (options) =>  ({
  alias: {
    '@SearchBox': path.resolve(__dirname, "./SearchBox.vue")
  },
  extendPageData($page) {
    pages[$page.path] = {
      title: rep($page.title),
      body: rep($page._content),
      url: $page.path,
      excerpt: rep($page.frontmatter.description || '')
    };
  },
  clientDynamicModules() {
    var serializedData = JSON.stringify(pages).replace(/[\\]/g, '\\\\')
.replace(/[\"]/g, '\\\"')
.replace(/[\/]/g, '\\/');
    return {
      name: 'es.js',
      content: `const IDX_DATA = JSON.parse("${serializedData}"); import elasticlunr from 'elasticlunr'; var idx = elasticlunr(function() { this.addField("title"); this.addField("excerpt"); this.addField("body"); this.setRef("url"); this.pipeline.before(elasticlunr.trimmer, (token) => { var o = token.toLowerCase().replace(/<\\/?[^>]+(>|$)/g, " ").replace(/[^0-9a-z ]+/g, ' ').replace(/^\\s+|\\s+$/g, '').split(' '); return o; } ); }); for (var o of Object.values(IDX_DATA)) { idx.addDoc(o); }; export default function QueryIndex(q, config) { return idx.search(q, config).map( (doc) => ({ _score: doc.score, ...IDX_DATA[doc.ref] })); };`
    };
  },
  define: {
    SEARCH_MAX_SUGGESTIONS: options.searchMaxSuggestions || 5,
    SEARCH_PATHS: options.test || null
  }
});
