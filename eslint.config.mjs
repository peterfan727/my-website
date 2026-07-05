import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  {
    ignores: [
      '.next/**',
      '.vercel/**',
      'out/**',
      'build/**',
      'coverage/**',
      '__tests__/**',
      '__mocks__/**',
    ],
  },
  ...nextVitals,
]);
