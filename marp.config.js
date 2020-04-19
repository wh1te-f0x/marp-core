const path = require('path')
const { Marp } = require('./lib/marp')

module.exports = {
  engine: (opts) => new Marp({ ...opts, minifyCSS: false }),
  server: true,
  inputDir: path.join(__dirname, './sandbox'),
}
