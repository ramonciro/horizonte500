import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B1220",
        surface: "#141B2D",
        surface2: "#1C2438",
        border: "#232C42",
        gold: "#C9A227",
        blue: "#4C7CF3",
        teal: "#2DD4BF",
        purple: "#8B5CF6",
        good: "#34D399",
        bad: "#F87171",
        muted: "#7C879E",
        ink: "#E7EAF0",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
