/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2ECC71", // main green
        primaryDark: "#28B766",
        primaryLight: "#DFFFEA",
        graySoft: "#F8F9FA",
        grayMedium: "#E5E7EB",
        grayText: "#6B7280",
        danger: "#E74C3C",
        warning: "#F4C430",
        info: "#3B82F6",
      },
    },
  },
  plugins: [],
};
