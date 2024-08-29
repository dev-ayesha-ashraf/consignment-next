/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#febd59',
        tertiary: '#bf842b',
        customBg: '#eddab7',
      },
      backgroundImage: theme => ({
        'gradient-primary': 'linear-gradient(140deg, hsl(36deg 99% 67%) 0%, hsl(36deg 87% 62%) 43%, hsl(36deg 79% 56%) 54%, hsl(35deg 77% 59%) 58%, hsl(35deg 85% 69%) 61%, hsl(36deg 100% 76%) 65%, hsl(35deg 85% 69%) 69%, hsl(35deg 77% 59%) 75%, hsl(36deg 79% 56%) 82%, hsl(36deg 87% 62%) 90%, hsl(36deg 99% 67%) 100%)',
      }),
    },
  },
  plugins: [],
}