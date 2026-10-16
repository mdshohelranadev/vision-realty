import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A5C3A",
          50: "#EEF7F2",
          100: "#D5EBDF",
          200: "#AAD6BF",
          300: "#76B997",
          400: "#439870",
          500: "#2A7B52",
          600: "#1A5C3A",
          700: "#164D31",
          800: "#123E28",
          900: "#0E2F1E",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#C89B3C",
          50: "#FBF6EA",
          100: "#F5E9C9",
          200: "#EBD395",
          300: "#DFBA62",
          400: "#C89B3C",
          500: "#A97F2B",
          foreground: "#1B1405",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.10)",
        lift: "0 2px 4px rgba(15,23,42,0.05), 0 20px 40px -12px rgba(26,92,58,0.22)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
