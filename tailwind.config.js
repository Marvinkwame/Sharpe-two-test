
module.exports = {
  darkMode: 'class', 
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
      },
      transitionDuration: {
        '200': '200ms',
      },
    },
  },
  plugins: [],
}