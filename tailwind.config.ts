import type { Config } from "tailwindcss";
import { createPlugin } from "windy-radix-palette";
import * as radixColors from "@radix-ui/colors";
const colors = createPlugin({
  colors: {
    slate: radixColors.slate,
    slateDark: radixColors.slateDark,
    indigo: radixColors.indigo,
    indigoDark: radixColors.indigoDark,
  },
});
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        textM: {
          50: "var(--textM-50)",
          100: "var(--textM-100)",
          200: "var(--textM-200)",
          300: "var(--textM-300)",
          400: "var(--textM-400)",
          500: "var(--textM-500)",
          600: "var(--textM-600)",
          700: "var(--textM-700)",
          800: "var(--textM-800)",
          900: "var(--textM-900)",
          950: "var(--textM-950)",
        },
        backgroundM: "var(--backgroundM)",
        primaryM: "var(--primaryM)",
        secondaryM: "var(--secondaryM)",
        accentM: "var(--accentM)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), colors.plugin],
} satisfies Config;

export default config;
