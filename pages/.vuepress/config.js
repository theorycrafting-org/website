const mdlatex = require("markdown-it-katex");
const mdcharts = require("../../plugins/mdit-charts-datatable/index.js");
module.exports = {
  themeConfig: {
    logo: '/tcwoli.png',
    nav: [
      {text: 'Test', link: '/page2', items: [
        {text: 'test2', link: '/'}
      ]

      }
    ]
  },
  head: [
    ['link', {rel: 'stylesheet', media: 'all', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css'}],
    ['link', {rel: 'stylesheet', media: 'all', href: 'https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css'}],
    ['link', { rel: 'stylesheet', media: 'all', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'}],
    ['script', {src: '//www.wowhead.com/widgets/power.js'}],
    // <script>var whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true, iconSize: 'medium'};</script>
//<script src="//www.wowhead.com/widgets/power.js" type="text/javascript"></script>]
  ],
  plugins: [
      require("../../plugins/lunr/index.js")({}),
      {
        extendMarkdown: md => {
          md.use(mdcharts);
          md.use(mdlatex);
        }
      }
  ]
}
