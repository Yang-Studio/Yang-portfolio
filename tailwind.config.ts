import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F2EFE8',
        'paper-deep': '#E8E4DA',
        rule: '#C9C5BD',
        'ink-soft': '#6B6862',
        ink: '#0E0E0C',
        accent: '#B5341A',
        coral: '#B5341A',
        sand: '#F2EFE8',
        slate: '#0E0E0C',
        sage: '#6B6862',
        mist: '#E8E4DA',
      },
      borderRadius: { sm: '0', md: '0', xl: '0', '2xl': '0' },
      boxShadow: {
        soft: 'none',
        glow: 'none',
      },
    },
  },
  plugins: [],
}

export default config
