const eslintPluginReact = require('eslint-plugin-react');
const eslintPluginTypeScript = require('@typescript-eslint/eslint-plugin');
const typeScriptParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typeScriptParser,
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypeScript,
      react: eslintPluginReact,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
