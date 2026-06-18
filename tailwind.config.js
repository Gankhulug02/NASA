/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        space: { 950: '#050510', 900: '#080818', 800: '#0d0d22' },
        nasa: { blue: '#0b3d91', red: '#fc3d21' },
      },
    },
  },
  plugins: [],
}
