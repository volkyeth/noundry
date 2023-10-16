const { nextui } = require("@nextui-org/react");
const containerQueries = require("@tailwindcss/container-queries");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Pix: ["Pix", "sans-serif"],
        RobotoFlex: ["Roboto Flex", "sans-serif"],
      },
      colors: {
        cool: "#d5d7e1",
        warm: "#e1d7d5",
        primary: "#FF2165",
        black: "#27282D",
        white: "#ECEDEE",
        light: "#F5F5F5",
        "bright-light": "#EBEBEB",
        "off-light": "#D0D1D2",
        dark: "#24272F",
        "bright-dark": "#3C4049",
        "off-dark": "#16191E",
        "exact-dark": "#3B4048",
      },
      screens: {
        xs: { min: "475px" },
      },
      transformOrigin: {
        0: "0%",
      },
      zIndex: {
        "-1": "-1",
      },
      boxShadow: {
        sm: "0 0 0 2px #e5e7eb",
        md: "0 0 0 4px #e5e7eb",
      },
    },
  },
  plugins: [nextui(), containerQueries],
};
