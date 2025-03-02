import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginNode from 'eslint-plugin-node';
import eslintPluginPromise from 'eslint-plugin-promise';
import eslintPluginSecurity from 'eslint-plugin-security';
import babelParser from '@babel/eslint-parser'; // Import the Babel parser directly

export default [
  {
    languageOptions: {
      globals: {
        node: true,
        es2021: true,
      },
      parser: babelParser, // Assign the Babel parser directly here
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false, // Disable Babel config file checking
      },
    },
  },
  {
    plugins: {
      import: eslintPluginImport,
      node: eslintPluginNode,
      promise: eslintPluginPromise,
      security: eslintPluginSecurity,
    },
  },
  {
    rules: {
      'comma-dangle': 'off',
      'max-len': [
        'error',
        {
          code: 120,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
        },
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: 'next',
        },
      ],
      'node/no-unsupported-features/es-syntax': 'off',
      'import/extensions': ['error', 'ignorePackages'],
      'no-console': 'warn',
    },
  },
  {
    ignores: [
      '.DS_Store',
      '/bin/**',
      '/build/**',
      '/coverage/**',
      '/docs/**',
      '/jsdoc/**',
      '/generators/app/templates/**/**',
      '/public/**',
      '/node_modules/**',
      '/lib-cov/**',
      '/logs/**',
      '/.idea/**',
      '/.nyc_output/**',
    ],
  },
];
