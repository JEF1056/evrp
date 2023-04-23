/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/daisyui/dist/**/*.{js,jsx,ts,tsx}",
    "node_modules/react-daisyui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        128: "32rem",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#99f6e4",
          "secondary": "#eab308",
          "accent": "#fca5a5",
          "neutral": "#4b5563",
          "base-100": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        }
      },
    ],
  },
  plugins: [require("daisyui")],
};
