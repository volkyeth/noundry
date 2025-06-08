const { nextui } = require("@nextui-org/react");
const { theme: nounsTheme } = require("./src/variants/nouns/theme");
const { theme: lilNounsTheme } = require("./src/variants/lil-nouns/theme");
const containerQueries = require("@tailwindcss/container-queries");
const colors = require("tailwindcss/colors");

// Import the app config to get the theme colors
// We need to use a dynamic approach since this is a Node.js module
// and we can't directly import the TypeScript config
const getThemeColors = () => {
  // Get the app variant from environment variable
  const appVariant = process.env.NEXT_PUBLIC_APP_VARIANT || "nouns";

  // Return the theme colors for the current variant
  return appVariant === "nouns" ? nounsTheme : lilNounsTheme;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/variants/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Pix: ["Pix", "sans-serif"],
        Inter: ["Inter Variable", "sans-serif"],
        Lora: ["Lora Variable", "sans-serif"],
      },
      colors: {
        cool: "#d5d7e1",
        warm: "#e1d7d5",
        // Use the theme colors from the app config
        primary: getThemeColors().primary,
        secondary: {
          DEFAULT: "#5d576b",
          100: "#dfdde1",
          200: "#bebcc4",
          300: "#9e9aa6",
          400: "#7d7989",
          500: "#5d576b",
          600: "#4a4656",
          700: "#383440",
          800: "#25232b",
          900: "#131115",
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
        xl: { min: "1440px" },
        "non-touchscreen": { raw: "(pointer: fine)" },
        touchscreen: { raw: "(pointer: coarse)" },
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
