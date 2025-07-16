module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
  ],
  plugins: [],
  root: true,
  ignorePatterns: ['.eslintrc.js', 'dist/', 'node_modules/'],
  rules: {
    'no-console': 'off', // Allow console for intentionally verbose logging
    'no-unused-vars': 'warn',
  },
}; 