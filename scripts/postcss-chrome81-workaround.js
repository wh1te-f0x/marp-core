import postcss from 'postcss'

const plugin = postcss.plugin('postcss-chrome81-workaround', () => (css) => {
  // Workaround for https://github.com/marp-team/marp-core/issues/158
  // TODO: Remove this plugin if resolved in the stable Chrome
  css.walkDecls(/^font(-family)?$/, (decl) => {
    decl.value = decl.value.replace(
      /['"]?(BlinkMacSystemFont|system-ui)['"]?(\s*,\s*)?/gi,
      (_, fontName) => {
        console.info(
          `[Chrome 81 workaround] Removed ${fontName} from ${decl.prop} declaration in`,
          css.source.input.from
        )
        return ''
      }
    )
  })
})

export default plugin
