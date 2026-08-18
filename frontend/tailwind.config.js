/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['SF Pro Display', 'Inter', '-apple-system', 'sans-serif'],
      },
      colors: {
        // NPIG Theme Palettes
        npig: {
          bg: {
            light: '#F8FAFC',
            dark: '#05070D',
          },
          surface: {
            light: '#FFFFFF',
            dark: '#0B1020',
          },
          elevated: {
            light: '#FFFFFF',
            dark: '#111827',
          },
          border: {
            light: '#E5E7EB',
            dark: 'rgba(255, 255, 255, 0.08)',
          },
          text: {
            primaryLight: '#111827',
            secondaryLight: '#64748B',
            primaryDark: '#F8FAFC',
            secondaryDark: '#94A3B8',
          },
          accent: {
            DEFAULT: '#6366F1', // Indigo / Violet
            deep: '#4F46E5',
            light: '#818CF8',
            hover: '#4338CA',
          },
          blue: {
            DEFAULT: '#3B82F6',
            subtle: '#2563EB',
            cyan: '#38BDF8',
          }
        },
        // Dark Mode Legacy & Extended Tokens
        void: '#05070D',
        deep: '#0B1020',
        base: '#111827',
        card: '#0B1020',
        elevated: '#111827',
        // Brand Accents
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3B82F6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          violet: '#6366F1',
          cyan: '#06B6D4',
        },
        severity: {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#f59e0b',
          low: '#3b82f6',
          minimal: '#10b981',
        },
      },
      backgroundImage: {
        'grid-dark': 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
        'grid-light': 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'glow-indigo': '0 0 24px rgba(99,102,241,0.35)',
        'glow-blue': '0 0 20px rgba(59,130,246,0.3)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.36)',
        'card-dark': '0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
        'card-light': '0 1px 3px rgba(0,0,0,0.05), 0 6px 16px rgba(0,0,0,0.03), 0 0 0 1px rgba(229,231,235,0.8)',
        'card-hover': '0 12px 36px rgba(99,102,241,0.12), 0 0 0 1px rgba(99,102,241,0.25)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float': 'float 3.5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.4s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.7', filter: 'drop-shadow(0 0 8px currentColor)' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 20px currentColor)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
