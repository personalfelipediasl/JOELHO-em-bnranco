
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#ff7841',
          500: '#ff5107',
          600: '#e64606',
          700: '#cc3d05',
        },
        surface: '#1a1a1a',
        background: '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        in: {
          '0%': { transform: 'translateY(18px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        in: 'in .6s both',
      },
    },
  },
  plugins: [],
}
