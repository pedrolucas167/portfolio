module.exports = {
  content: ['./*.html', './Assets/src/*.css', './script.js'],

  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#0078d7',
        primaryHover: '#0056a4',
      },
    },
  },
  plugins: [],
};
