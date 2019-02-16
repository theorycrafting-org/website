const { path } = require('@vuepress/shared-utils')

module.exports = (options, context) => ({
  clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js')
})
