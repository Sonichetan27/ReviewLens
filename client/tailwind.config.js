/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF9',
        surface: '#F5F5F4',
        ink: '#1C1917',
        muted: '#78716C',
        line: '#E7E5E4',
        accent: {
          DEFAULT: '#0D9488',
          hover: '#0F766E',
        },
        trust: {
          high: '#059669',
          medium: '#D97706',
          risk: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(28 25 23 / 0.06)',
      },
    },
  },
  plugins: [],
};
