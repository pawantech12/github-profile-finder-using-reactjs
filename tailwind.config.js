/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-light-blue": "#f6f8ff",
        "custom-light": "#F5F8FF",
        "custom-gray": "#B3BDCF",
      },
      boxShadow: {
        "custom-blue": "0rem 0.3rem 0.5rem rgba(75,106,155,.15)",
      },
    },
  },
  plugins: [typography],
};
