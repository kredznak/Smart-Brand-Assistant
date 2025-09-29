module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: { browser: true, node: true, es2022: true },
  ignorePatterns: ['dist', 'dist-server'],
  rules: {
    'import/order': ['warn', { 'newlines-between': 'always' }]
  }
};

