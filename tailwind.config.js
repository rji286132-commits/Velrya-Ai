/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        velrya: {
          900: '#0a0a0f',
          800: '#11111b',
          700: '#181825',
          600: '#1e1e2e',
          accent: '#7c3aed',
          glow: '#a855f7',
        },
      },
      boxShadow: {
        'velrya': '0 0 30px rgba(124, 58, 237, 0.3)',
        'velrya-3d': '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(124, 58, 237, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
