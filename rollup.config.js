import path from 'path'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import autoprefixer from 'autoprefixer'
import postcssUrl from 'postcss-url'
import postcss from 'rollup-plugin-postcss'
import { string } from 'rollup-plugin-string'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import postcssChrome81Workaround from './scripts/postcss-chrome81-workaround'
import postcssOptimizeDefaultTheme from './scripts/postcss-optimize-default-theme'

const plugins = [
  json({ preferConst: true }),
  nodeResolve({ mainFields: ['module', 'jsnext:main', 'main'] }),
  commonjs(),
  string({ include: ['lib/*.js'] }),
  alias({
    entries: [
      {
        find: /^.+browser-script$/,
        replacement: path.resolve(__dirname, './lib/browser.js'),
      },
    ],
  }),
  typescript(),
  postcss({
    inject: false,
    minimize: {
      preset: [
        'default',
        {
          // Some minifers will apply on runtime to make debug easily.
          minifyParams: false,
          minifySelectors: false,
          normalizeWhitespace: false,
        },
      ],
    },
    plugins: [
      postcssOptimizeDefaultTheme(),
      postcssChrome81Workaround(),
      postcssUrl({
        filter: '**/assets/**/*.svg',
        encodeType: 'base64',
        url: 'inline',
      }),
      autoprefixer(),
    ],
  }),
  !process.env.ROLLUP_WATCH && terser(),
]

export default [
  {
    input: 'scripts/browser.js',
    output: { file: 'lib/browser.js', format: 'iife' },
    plugins,
  },
  {
    input: 'src/browser.ts',
    output: { exports: 'named', file: 'lib/browser.cjs.js', format: 'cjs' },
    plugins,
  },
  {
    external: [...Object.keys(pkg.dependencies), '@marp-team/marpit/plugin'],
    input: `src/${path.basename(pkg.main, '.js')}.ts`,
    output: { exports: 'named', file: pkg.main, format: 'cjs' },
    plugins,
  },
]
