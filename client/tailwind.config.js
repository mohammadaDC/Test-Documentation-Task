/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf6ee',
          100: '#fae9d2',
          200: '#f4d0a1',
          300: '#ecb169',
          400: '#e49040',
          500: '#dc7222',
          600: '#ce5918',
          700: '#ab4116',
          800: '#893419',
          900: '#6f2c17',
          950: '#3c140a',
        },
        navy: {
          50:  '#eef2ff',
          100: '#dce6ff',
          700: '#1e3a8a',
          800: '#1e3070',
          900: '#0f1f4d',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans:  ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
