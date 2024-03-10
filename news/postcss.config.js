/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require('tailwindcss'),
    require('@thedutchcoder/postcss-rem-to-px')
  ]
}

module.exports = config