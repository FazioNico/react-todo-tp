/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'sidebar': '#f5f5f5',
        'sidebar-hover': '#efefef',
        'primary': '#0070f3',
      }
    },
  },
  plugins: [],
}
