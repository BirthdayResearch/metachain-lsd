import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Space Grotesk"', "sans-serif"],
    },
    colors: {
      transparent: "rgba(0, 0, 0 ,0)",
      dark: {
        "00": "#000000",
        100: "#121212",
        200: "#2B2B2B",
        300: "#333333",
        500: "#8C8C8C",
        700: "#A6A6A6",
        800: "#D9D9D9",
        900: "#F2F2F2",
        1000: "#FFFFFF",
        "card-stroke": "rgba(51, 51, 51, 0.5)",
      },
      light: {
        "00": "#FFFFFF",
        100: "#F2F2F2",
        200: "#D9D9D9",
        300: "#CCCCCC",
        500: "#737373",
        700: "#595959",
        800: "#2B2B2B",
        900: "#121212",
        1000: "#000000",
        "card-stroke": "rgba(204, 204, 204, 0.3)",
      },
      brand: {
        100: "#FF00AF",
        200: "#1530CC",
      },
      primary: {
        50: "#E8DEFF",
        100: "#D9C7FF",
        200: "#B999FF",
        250: "#AD87FF",
        300: "#9A6BFF",
        400: "#7A3DFF",
        500: "#5B10FF",
        600: "#4A00EB",
        700: "#3E00C7",
        800: "#3400A3",
        900: "#28007F",
      },
      gray: {
        50: "#FAFAFA",
        75: "#F9F9F9",
        100: "#F5F5F5",
        200: "#E5E5E5",
        300: "#D4D4D4",
        400: "#A3A3A3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
      },
      error: "#E54545",
      warning: "#D97B01",
      valid: "#0CC72C",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
