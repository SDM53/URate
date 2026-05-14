import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  eslintConfigPrettier,

  // ─────────────────────────────────────────────
  // NODE ENVIRONMENT FOR SERVER.JS
  // Tells ESLint that server.js runs in Node so
  // globals like console, process, __dirname etc.
  // are valid. Without this ESLint flags them as
  // undefined since it defaults to browser globals.
  // ─────────────────────────────────────────────
  {
    files: ['server.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
];
