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
        // Official Spiracle brand colours from Identity Kit
        cream: '#F9F7ED',
        'cream-dark': '#F4EEDC',
        'warm-cream': '#E8E1CF',
        black: '#000000',
        green: '#266D36',
        'green-dark': '#2F5337',
        blush: '#EBDEDB',
        rust: '#9F4300',
        burgundy: '#730000',
        sage: '#C0C9C2',
        navy: '#47507C',
        'navy-dark': '#333B51',
        yellow: '#F1E5A3',
        // Semantic aliases
        'warm-grey': '#6B6560',
        'dark-grey': '#2D2A26',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'page-flip': 'pageFlip 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
        pageFlip: {
          '0%, 100%': { transform: 'rotateY(0deg)', opacity: '0.4' },
          '50%': { transform: 'rotateY(-30deg)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
