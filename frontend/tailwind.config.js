/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        // Dark theme palette
        void:    '#030712',
        deep:    '#080d1a',
        base:    '#0a1128',
        card:    '#0d1632',
        elevated:'#111e40',
        // Brand
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        neon: {
          blue:   '#00d4ff',
          green:  '#00ff94',
          red:    '#ff2d6b',
          purple: '#bf5af2',
          amber:  '#ffd60a',
        },
        severity: {
          critical: '#ff2d6b',
          high:     '#f97316',
          medium:   '#f59e0b',
          low:      '#3b82f6',
          minimal:  '#22c55e',
        },
      },
      backgroundImage: {
        'grid-dark':    'linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
      boxShadow: {
        'glow-blue':    '0 0 20px rgba(37,99,235,0.4)',
        'glow-cyan':    '0 0 20px rgba(6,182,212,0.4)',
        'glow-red':     '0 0 20px rgba(239,68,68,0.4)',
        'glow-green':   '0 0 20px rgba(16,185,129,0.4)',
        'glass':        '0 8px 32px rgba(0,0,0,0.4)',
        'card':         '0 4px 24px rgba(0,0,0,0.35)',
        'card-hover':   '0 8px 40px rgba(37,99,235,0.15)',
        'inner-glow':   'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'pulse-glow':   'pulseGlow 2s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
        'scan':         'scan 4s linear infinite',
        'fade-up':      'fadeUp 0.4s ease forwards',
        'slide-in':     'slideIn 0.3s ease forwards',
        'spin-slow':    'spin 3s linear infinite',
        'data-stream':  'dataStream 3s ease infinite',
        'blink':        'blink 1s step-end infinite',
        'waveform':     'waveform 1.5s ease infinite',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%,100%': { opacity: '0.6', boxShadow: '0 0 8px currentColor' },
          '50%': { opacity: '1', boxShadow: '0 0 24px currentColor' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        dataStream: {
          '0%': { opacity: '0', transform: 'translateY(0)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        waveform: {
          '0%,100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
