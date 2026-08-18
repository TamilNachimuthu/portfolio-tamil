/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#0C0F14',
          panel: '#12161E',
          panel2: '#171C26',
          line: '#232A38',
        },
        ink: {
          DEFAULT: '#E7E9EE',
          muted: '#8B93A7',
          faint: '#586178',
        },
        signal: {
          mint: '#4FE9C6',
          amber: '#F2A94E',
          coral: '#F2726B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(180deg, rgba(79,233,198,0.06) 0%, rgba(12,15,20,0) 60%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(79,233,198,0.15), 0 8px 30px rgba(79,233,198,0.08)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: 1 },
          '50%, 100%': { opacity: 0 },
        },
        pulseDot: {
          '0%': { boxShadow: '0 0 0 0 rgba(79,233,198,0.55)' },
          '70%': { boxShadow: '0 0 0 8px rgba(79,233,198,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(79,233,198,0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(8deg)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        twinkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
          '50%': { transform: 'scale(1.2) rotate(12deg)', opacity: 0.7 },
        },
        bounceY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.6)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        pulseDot: 'pulseDot 2s infinite',
        float: 'float 3.5s ease-in-out infinite',
        wiggle: 'wiggle 1.4s ease-in-out infinite',
        spinSlow: 'spinSlow 6s linear infinite',
        twinkle: 'twinkle 2.2s ease-in-out infinite',
        bounceY: 'bounceY 1.6s ease-in-out infinite',
        popIn: 'popIn 0.4s cubic-bezier(.34,1.56,.64,1) both',
      },
    },
  },
  plugins: [],
}
