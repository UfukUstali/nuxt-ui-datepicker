import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: ["docs/content/**/*.md"],
  plugins: [require("@tailwindcss/container-queries")],
  theme: {
    extend: {
      colors: {
        orange: {
          50: "#fff7e6",
          100: "#ffebd2",
          200: "#ffd8a5",
          300: "#ffc479",
          400: "#ffb14c",
          500: "#ff9d1f",
          600: "#cc7e19",
          700: "#995e13",
          800: "#663f0c",
          900: "#331f06",
          950: "#1a0f03",
        },
        dark_green: {
          50: "#e8f0e7",
          100: "#d4ded0",
          200: "#aabda1",
          300: "#7f9b73",
          400: "#557a44",
          500: "#2a5915",
          600: "#224711",
          700: "#19350d",
          800: "#112408",
          900: "#081204",
          950: "#040602",
        },
        light_green: {
          50: "#f9fef4",
          100: "#f4feeb",
          200: "#e9fdd8",
          300: "#ddfdc4",
          400: "#d2fcb1",
          500: "#c7fb9d",
          600: "#9fc97e",
          700: "#77975e",
          800: "#50643f",
          900: "#28321f",
          950: "#14190f",
        },
        dark_gray: {
          50: "#f2f2f2",
          100: "#ededed",
          200: "#dadada",
          300: "#c8c8c8",
          400: "#b5b5b5",
          500: "#a3a3a3",
          600: "#828282",
          700: "#626262",
          800: "#414141",
          900: "#212121",
          950: "#101010",
        },
      },
    },
  },
};
