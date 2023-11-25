import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const tailwindConfig: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,md,mdx}'],
  theme: {
    screens: {
      ...defaultTheme.screens,
    },
    fontFamily: {
      sans: ['var(--font-family-inter)', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
};

export default tailwindConfig;
