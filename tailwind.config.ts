import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: '#faf5e9',
        paper: '#fffdf6',
        ink: '#30251e',
        tomato: '#a32d24',
        tomatoDark: '#81221c',
        olive: '#4c583b',
        border: '#d8cbb8',
        muted: '#716353'
      },
      fontFamily: {
        body: ['Arial', 'Helvetica', 'sans-serif'],
        heading: ['Georgia', 'Times New Roman', 'serif']
      }
    }
  },
  plugins: []
};

export default config;
