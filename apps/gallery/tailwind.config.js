const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        Pix: ["Pix", "sans-serif"],
        RobotoFlex: ["Roboto Flex", "sans-serif"],
      },
      colors: {
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
        "2xl": { min: "962px", max: "2960px" },
        xl: { min: "830px", max: "961px" },
        lg: { min: "775px", max: "829px" },
        md: { min: "598px", max: "774px" },

        sm: { max: "368px" },
        dsm: { max: "640px" },
        dmd: { max: "768px" },
        dlg: { max: "1024px" },
        dxl: { max: "1280px" },
        d2xl: { max: "1536px" },
        // 'xs': { min: '480px', max: '539px' },
        // '@md': { min: '640px', max: '767px' },
        // '@lg': { min: '768px', max: '1023px' },
        // '@xl': { min: '934px', max: '1034px' },
        // '@2xl': { min: '634px', max: '834px' },
      },
      transformOrigin: {
        0: "0%",
      },
      zIndex: {
        "-1": "-1",
      },
    },
  },
  plugins: [nextui()],
};
