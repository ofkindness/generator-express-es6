const eslintPluginImport = require('eslint-plugin-import');
const eslintPluginNode = require('eslint-plugin-node');
const eslintPluginPromise = require('eslint-plugin-promise');
const eslintPluginSecurity = require('eslint-plugin-security');

module.exports = [
  // Define global variables for Node.js
  {
    languageOptions: {
      globals: {
        node: true, // Node.js environment
        es2021: true, // ES2021 features
      },
    },
  },

  // Add plugins
  {
    plugins: {
      import: eslintPluginImport,
      node: eslintPluginNode,
      promise: eslintPluginPromise,
      security: eslintPluginSecurity,
    },
  },

  // Custom rules
  {
    rules: {
      'comma-dangle': 'off', // Disable comma-dangle rule
      'max-len': [
        'error',
        {
          code: 120, // Max line length
          ignoreComments: true, // Ignore comments
          ignoreUrls: true, // Ignore URLs
          ignoreStrings: true, // Ignore strings
        },
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: 'next', // Ignore 'next' in Express middleware
        },
      ],
      'node/no-unsupported-features/es-syntax': 'off', // Allow modern ES features
      'import/extensions': ['error', 'ignorePackages'], // Ignore file extensions for imports
      'no-console': 'warn', // Warn on console.log usage
    },
  },
];