/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gh: {
          bg: '#0d1117',
          surface: '#161b22',
          subtle: '#21262d',
          border: '#30363d',
          text: '#f0f6fc',
          muted: '#8b949e',
          green: '#238636',
          greenHover: '#2ea043',
          blue: '#58a6ff',
          purple: '#bc8cff',
          orange: '#d29922',
          red: '#f85149',
          yellow: '#e3b341'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans', 'Helvetica', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
