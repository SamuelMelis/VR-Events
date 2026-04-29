import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // Minimal palette — neutrals + a single indigo accent.
        ink: {
          DEFAULT: "#0a0a0a",
          muted: "#525252",
          subtle: "#737373",
        },
        line: "#e5e5e5",
        surface: {
          DEFAULT: "#ffffff",
          alt: "#fafafa",
        },
        accent: {
          DEFAULT: "#4f46e5",
          fg: "#ffffff",
          soft: "#eef2ff",
        },
        positive: "#15803d",
        warn: "#b45309",
        danger: "#b91c1c",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10, 10, 10, 0.04), 0 0 0 1px rgba(10, 10, 10, 0.04)",
      },
      borderRadius: {
        lg: "0.625rem",
      },
    },
  },
  plugins: [],
};

export default config;
