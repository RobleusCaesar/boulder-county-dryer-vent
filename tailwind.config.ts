import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0D7377",
          950: "#06393B",
          900: "#095456",
          800: "#095456",
          700: "#0D7377",
          600: "#0D7377",
          500: "#14959A",
          100: "#E6F3F3",
          50: "#E6F3F3",
        },
        charcoal: {
          DEFAULT: "#2C3333",
          800: "#2C3333",
          600: "#5A6363",
          400: "#5A6363",
        },
        wash: "#F7F8F8",
        line: "#E2E5E5",
        cream: "#F7F8F8",
        paper: "#F7F8F8",
      },
      fontFamily: {
        display: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(44, 51, 51, 0.06), 0 8px 24px rgba(13, 115, 119, 0.06)",
        lift: "0 10px 30px rgba(9, 84, 86, 0.12)",
      },
      maxWidth: {
        site: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
