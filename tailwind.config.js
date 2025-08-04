/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // ajuste para seus caminhos reais
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bgDark: 'var(--color-bg-dark)',
        bgTerminal: 'var(--color-bg-terminal)',
        border: 'var(--color-border)',
        green: 'var(--color-green)',
        greenHover: 'var(--color-green-hover)',
        yellow: 'var(--color-yellow)',
        red: 'var(--color-red)',
        blue: 'var(--color-blue)',
        textLight: 'var(--color-text-light)',
        textWhite: 'var(--color-text-white)',
      },
    },
  },
  plugins: [],
}
