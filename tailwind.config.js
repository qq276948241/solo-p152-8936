/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2D1B4E",
          50: "#E8E0F5",
          100: "#D4C5EB",
          200: "#B095D7",
          300: "#8C65C3",
          400: "#6540A1",
          500: "#2D1B4E",
          600: "#24153E",
          700: "#1B102E",
          800: "#120A1F",
          900: "#09050F",
        },
        accent: {
          DEFAULT: "#FF6B35",
          50: "#FFE9E0",
          100: "#FFD4C1",
          200: "#FFAB83",
          300: "#FF8345",
          400: "#FF6B35",
          500: "#E8531D",
          600: "#C04214",
          700: "#973410",
          800: "#6E250B",
          900: "#461707",
        },
        surface: {
          DEFAULT: "#3A2460",
          light: "#4A2E75",
          dark: "#1F1138",
        },
      },
      fontFamily: {
        sans: [
          "Space Grotesk",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Noto Sans SC",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.25)",
        "card-hover": "0 8px 32px rgba(255, 107, 53, 0.2)",
        glow: "0 0 20px rgba(255, 107, 53, 0.4)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
