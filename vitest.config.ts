/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    coverage: {
      exclude: ['src/utils/constants.ts']
    }
  },
});