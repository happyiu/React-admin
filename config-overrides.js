const { 
  override,
  fixBabelImports,
  addLessLoader,
  addDecoratorsLegacy
} = require('customize-cra')

const theme = require('./theme.js')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
    style: true,
  }),
  addDecoratorsLegacy(),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: theme,
  })
)