import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const StringReplacePlugin = require("string-replace-webpack-plugin");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'unicode-properties': 'unicode-properties/unicode-properties.cjs.js',
      'pdfkit': 'pdfkit/js/pdfkit.js'
    }
  },
  plugins: [new StringReplacePlugin()],
  module: {
    rules: [
        ...
        {
          enforce: 'pre',
          test: /unicode-properties[\/\\]unicode-properties/,
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: "var fs = _interopDefault(require('fs'));",
                replacement: function () {
                  return "var fs = require('fs');";
                }
              }
            ]
          })
        },
        {test: /unicode-properties[\/\\]unicode-properties/, loader: "transform-loader?brfs"},
        {test: /pdfkit[/\\]js[/\\]/, loader: "transform-loader?brfs"},
        {test: /fontkit[\/\\]index.js$/, loader: "transform-loader?brfs"},
        {test: /linebreak[\/\\]src[\/\\]linebreaker.js/, loader: "transform-loader?brfs"}            
    ]
  }
  // server: {
  //   proxy: {
  //     '/api' : 'http://localhost:8000',
  //   }
  // }
})