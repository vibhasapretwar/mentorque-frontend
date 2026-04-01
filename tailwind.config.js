/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde6ff',
          500: '#4f6ef7',
          600: '#3d5ce8',
          700: '#2d4ad4',
          900: '#1a2fa0',
        }
      }
    }
  },
  plugins: [],
}
