import globals from "globals";

export default [
  {
    ignores: ['node_modules', 'frontend/dist/*', 'tests/*'],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node
    },
    rules: {
      'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
      'semi': ['error', 'always'],
      'no-console': 'warn',
    }
  },
  {
    files: ['index.js', 'config/database.js', 'config/insertDataScript.js',],  
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',  
    },
  },
];
