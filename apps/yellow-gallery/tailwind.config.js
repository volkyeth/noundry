const { nextui } = require("@nextui-org/react");
const containerQueries = require("@tailwindcss/container-queries");
const colors = require("tailwindcss/colors");

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
        Pally: ["Pally", "sans-serif"],
        Inter: ["Inter Variable", "sans-serif"],
        Lora: ["Lora Variable", "sans-serif"],
      },
      colors: {
        brand: {
          yellow: "#FBCB07",
          blue: "#0786fb",
          "off-black": "#222222",
        },
        cool: "#dce5fd",
        warm: "#fcefbb",
        primary: {
          DEFAULT: "#0786fb",
          50: "#edfbff",
          100: "#d6f4ff",
          200: "#b7edff",
          300: "#85e4ff",
          400: "#4bd2ff",
          500: "#22b5ff",
          600: "#0a98ff",
          700: "#0786fb",
          800: "#0b65c2",
          900: "#0f5799",
          950: "#0f355c",
        },
        secondary: {
          DEFAULT: "#373f51",
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d4d9e3",
          300: "#afb8ca",
          400: "#8492ac",
          500: "#647493",
          600: "#505d79",
          700: "#414b63",
          800: "#373f51",
          900: "#333947",
          950: "#22262f",
        },

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
        xs: "0 1px #e5e7eb",
        sm: "0 2px #e5e7eb",
        md: "0 4px #e5e7eb",
        lg: "0 6px #e5e7eb",
        xl: "0 8px #e5e7eb",
        inset: "0 -2px #e5e7eb",
        "inset-md": "0 -4px #e5e7eb",
      },
      // @TODO customize drop-shadow
    },
  },
  plugins: [
    nextui({
      layout: {
        radius: {
          small: "0px",
          medium: "0px",
          large: "0px",
        },
      },
    }),
    containerQueries,
  ],
};
