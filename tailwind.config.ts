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
          DEFAULT: '#1e40af',
          light: '#3b82f6',
          dark: '#172554',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        navy: {
          DEFAULT: '#0f172a',
          light: '#334155',
          dark: '#020617',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334e68',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Medical Category Colors
        medical: {
          // Ortho (ribs, pelvis) - Slate/Blue-gray tones
          ortho: {
            light: '#f1f5f9',    // slate-100
            DEFAULT: '#475569',  // slate-600
            dark: '#1e293b',     // slate-800
            accent: '#64748b',   // slate-500
            hover: '#334155',    // slate-700
            ring: '#cbd5e1'      // slate-300
          },
          // Vascular (BCVI, heme) - Muted Rose/Coral tones
          vascular: {
            light: '#ffe4e6',    // rose-100
            DEFAULT: '#be123c',  // rose-700
            dark: '#881337',     // rose-900
            accent: '#e11d48',   // rose-600
            hover: '#9f1239',    // rose-800
            ring: '#fecdd3'      // rose-200
          },
          // Solid Organs (spleen, liver, kidney) - Teal/Emerald tones
          solid: {
            light: '#d1fae5',    // emerald-100
            DEFAULT: '#059669',  // emerald-600
            dark: '#064e3b',     // emerald-900
            accent: '#10b981',   // emerald-500
            hover: '#047857',    // emerald-700
            ring: '#a7f3d0'      // emerald-200
          },
          // Endocrine (adrenal insufficiency) - Amber/Gold tones
          endocrine: {
            light: '#fef3c7',    // amber-100
            DEFAULT: '#d97706',  // amber-600
            dark: '#78350f',     // amber-900
            accent: '#f59e0b',   // amber-500
            hover: '#b45309',    // amber-700
            ring: '#fde68a'      // amber-200
          },
          // Airway - Sky/Cyan tones
          airway: {
            light: '#e0f2fe',    // sky-100
            DEFAULT: '#0284c7',  // sky-600
            dark: '#0c4a6e',     // sky-900
            accent: '#0ea5e9',   // sky-500
            hover: '#0369a1',    // sky-700
            ring: '#bae6fd'      // sky-200
          },
          // Neuro (brain, default) - Indigo tones
          neuro: {
            light: '#e0e7ff',    // indigo-100
            DEFAULT: '#4f46e5',  // indigo-600
            dark: '#312e81',     // indigo-900
            accent: '#6366f1',   // indigo-500
            hover: '#4338ca',    // indigo-700
            ring: '#c7d2fe'      // indigo-200
          }
        },
        // Silver (Slate-based for cooler medical look - Gemini)
        silver: {
          DEFAULT: '#f1f5f9',
          light: '#ffffff',
          dark: '#e2e8f0',
          50: '#f8fafc',   // slate-50
          100: '#f1f5f9',  // slate-100
          200: '#e2e8f0',  // slate-200
          300: '#cbd5e1',  // slate-300
          400: '#94a3b8',  // slate-400
          500: '#64748b',  // slate-500
          600: '#475569',  // slate-600
          700: '#334155',  // slate-700
          800: '#1e293b',  // slate-800
          900: '#0f172a'   // slate-900
        },
        teal: {
          DEFAULT: '#0d9488',
          light: '#5eead4',
          dark: '#115e59',
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59'
        },
        coral: {
          DEFAULT: '#e11d48',
          light: '#fda4af',
          dark: '#9f1239',
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239'
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
          blue: '#3b82f6',
          teal: '#14b8a6',
          coral: '#f43f5e',
          gold: '#f59e0b',
          emerald: '#10b981',
          sky: '#0ea5e9'
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 30px rgba(59, 130, 246, 0.15)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.2)',
        'glow-rose': '0 0 20px rgba(225, 29, 72, 0.15)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.2)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.2)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      }
    }
  },
  plugins: [],
}
export default config
