/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        'unit': '8px',
      },
      fontSize: {
        'ui': '13px',
        'content': '14px',
      },
      width: {
        'sidebar': '250px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
