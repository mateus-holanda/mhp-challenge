/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          light: '#4FCCB1',
          neutral: '#10B395',
          dark: '#0A826D',
        },
        secondary: {
          light: '#263352',
          neutral: '#0F172A',
          dark: '#060B15',
        },
        background: {
          default: '#FFFFFF',
          paper: '#F6F7F9',
          'light-blue': '#F5F9FF',
          header: '#E2E8F0',
          accent: '#F1F5F9',
        },
        blue: {
          '10': '#F6F7F9',
          '30': '#B7BECD',
          '60': '#64748B',
          '80': '#263352',
          '100': '#0F172A',
          '120': '#060B15',
        },
        'light-blue': {
          '10': '#F5F9FF',
          '20': '#D2E0F4',
          '60': '#A4BDE2',
          '80': '#7198CF',
          '100': '#4F7CBD',
          '120': '#2F5994',
        },
        success: {
          light: '#92D3A4',
          neutral: '#24A649',
          dark: '#1C8A3B',
        },
        warning: {
          light: '#F19C3A',
          neutral: '#DC7609',
          dark: '#A85A06',
        },
        danger: {
          light: '#FFDEE0',
          neutral: '#EF4444',
          dark: '#DF0C3D',
        },
        border: '#E2E8F0',
        input: 'hsl(var(--input))',
        ring: '#10B395',
        foreground: 'hsl(var(--foreground))',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        pulsing: {
          '0%': { transform: 'scale(0.98)', opacity: '0.5' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
          '100%': { transform: 'scale(0.98)', opacity: '0.5' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        pulsing: 'pulsing 2.5s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
