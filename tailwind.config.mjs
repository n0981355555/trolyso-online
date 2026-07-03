/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#2563EB',
          mint: '#10B981',
          darkBg: '#0F172A',
          darkCard: '#1E293B'
        }
      }
    },
  },
  plugins: [],
}
