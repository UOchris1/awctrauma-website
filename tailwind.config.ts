import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a',
          light: '#3b5998',
          dark: '#0f172a',
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#1e3a8a',
          900: '#0f172a'
        },
        navy: {
          DEFAULT: '#1e3a5f',
          light: '#2e4a6f',
          dark: '#0e2254',
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#7b8fa8',
          500: '#5c7186',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43'
        },
        silver: {
          DEFAULT: '#f8f9fa',
          light: '#ffffff',
          dark: '#e9ecef',
          50: '#fafbfc',
          100: '#f8f9fa',
          200: '#f1f3f5',
          300: '#e9ecef',
          400: '#dee2e6',
          500: '#ced4da',
          600: '#adb5bd',
          700: '#868e96',
          800: '#495057',
          900: '#343a40'
        },
        teal: {
          DEFAULT: '#008B8B',
          light: '#20B2AA',
          dark: '#006666',
          50: '#e6fffa',
          100: '#b3ffe6',
          200: '#66ffd1',
          300: '#1affba',
          400: '#00e6a0',
          500: '#008B8B',
          600: '#007070',
          700: '#005555',
          800: '#003939'
        },
        coral: {
          DEFAULT: '#FF6B6B',
          light: '#FF8787',
          dark: '#E55555',
          50: '#fff1f1',
          100: '#ffe4e4',
          200: '#ffcccc',
          300: '#ffa8a8',
          400: '#ff8787',
          500: '#FF6B6B',
          600: '#e55555',
          700: '#cc4040',
          800: '#b22a2a'
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121'
        },
        accent: {
          blue: '#2090f3',
          teal: '#008B8B',
          coral: '#FF6B6B',
          gold: '#FFB347'
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 30px rgba(59, 130, 246, 0.15)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [],
}
export default config