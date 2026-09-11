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
          950: "#062729",
          900: "#0A3D40",
          800: "#0D4F54",
          700: "#12656B",
          600: "#187A80",
          500: "#2A9AA1",
          100: "#D7EEEF",
          50: "#F0F7F7",
        },
        charcoal: {
          DEFAULT: "#1B1F23",
          800: "#2A3036",
          600: "#4A525A",
          400: "#6B737C",
        },
        cream: "#F6F3EC",
        paper: "#FBFAF7",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27, 31, 35, 0.06), 0 8px 24px rgba(10, 61, 64, 0.06)",
        lift: "0 10px 30px rgba(10, 61, 64, 0.12)",
      },
      maxWidth: {
        site: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
