/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{   
        'bg':'#ffe5b4'
      },
      fontFamily:{
        head:['Merienda'],
        write:['Flamenco','Merienda'],
        Coming:['Coming Soon', 'cursive'],
        Acme:['Acme'],  
      }
    },
  },
  plugins: [],
}

