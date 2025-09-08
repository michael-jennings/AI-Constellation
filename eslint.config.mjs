import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['data/*'],
    languageOptions: {
      parser: tsParser,
    },
  },
];
