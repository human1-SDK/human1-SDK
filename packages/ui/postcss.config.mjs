/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    'tailwindcss': {
      config: './tailwind.config.mjs',
    },
    'autoprefixer': {},
    'postcss-modules': {
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
}; 