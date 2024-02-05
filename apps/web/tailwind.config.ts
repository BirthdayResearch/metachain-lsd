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
    screens: {
      xs: "390px", // Mobile - Large
      sm: "640px",
      md: "768px", // Tablet
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px", // Web - Extra large
    },
    extend: {
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
        },
        brand: {
          100: "#69FF23",
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
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
