import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ['"Space Grotesk"', "sans-serif"],
      mono: ['"Montserrat"', "sans-serif"],
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
        red: "#FF4F4F",
        error: "#E54545",
        warning: "#D97B01",
        valid: "#0CC72C",
      },
      borderRadius: {
        DEFAULT: "5px",
        md: "10px",
        lg: "15px",
        xl: "20px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
