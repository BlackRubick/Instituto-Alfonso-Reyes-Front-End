/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#1A9E96',
          dark: '#0D6B65',
          bg: '#0E2F2E'
        },
        accent: {
          gold: '#E8A800',
          orange: '#E07B00'
        },
        neutral: {
          white: '#FFFFFF',
          light: '#F2F2F2',
          medium: '#E0E0E0',
          dark: '#333333'
        }
      },
      spacing: {
        'section': '6rem',
      },
      borderRadius: {
        'xl': '1rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.1)',
      }
    }
  },
  plugins: [],
}
