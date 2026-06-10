/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#8234E9", "primary-light": "#9956F6", green: "#29E0A9",
        blue: "#5F75F2", magenta: "#E254FF", bg: "#09090B", surface: "#141419",
        "surface-2": "#1c1c24", border: "#26262e", "text-dim": "#a1a1aa",
      },
    },
  },
  plugins: [],
};
