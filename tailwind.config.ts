import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial — Clínica Cultural y Lingüística de Español
        'clinic-red': '#D84C4C', // Rojo Clínico Suave
        'clinic-green': '#5A8C6E', // Verde Medicinal
        'clinic-gold': '#D4A574', // Dorado Andaluz
        'clinic-blue': '#2C3E50', // Azul Profundo
        'clinic-white': '#FAFAFA', // Blanco Médico
        'clinic-gray': '#E8E8E8', // Gris Suave
      },
      fontFamily: {
        heading: ['var(--font-fraunces)', 'Georgia', 'serif'],
        body: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
