import type { Config } from 'tailwindcss';

const tailwindConfig: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/primereact/**/*.esm.js',
    // '../../node_modules/primereact/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
  theme: {},
};

export default tailwindConfig;
