import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        clinical: {
          primary: '#1e3a8a', // Deep Clinical Navy
          'primary-hover': '#172554',
          accent: '#0284c7', // Muted Medical Blue
          subtle: '#f0f4f8',
          border: '#e2e8f0',
        },
        status: {
          good: {
            text: '#166534',
            bg: '#f0fdf4',
            border: '#bbf7d0',
            dot: '#22c55e',
          },
          warning: {
            text: '#9a3412',
            bg: '#fff7ed',
            border: '#fed7aa',
            dot: '#f97316',
          },
          danger: {
            text: '#991b1b',
            bg: '#fef2f2',
            border: '#fecaca',
            dot: '#ef4444',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        'lab': '6px',
      },
    },
  },
  plugins: [],
};

export default config;
