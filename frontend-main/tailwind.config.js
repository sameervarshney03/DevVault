/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0b1326",
        surface: "#0b1326",
        "surface-container-lowest": "#060e20",
        "surface-container-low": "#131b2e",
        "surface-container": "#171f33",
        "surface-container-high": "#222a3d",
        "surface-container-highest": "#2d3449",
        "surface-bright": "#31394d",
        "on-surface": "#dae2fd",
        "on-surface-variant": "#c2c6d6",
        primary: "#adc6ff",
        "primary-container": "#4d8eff",
        "on-primary": "#002e6a",
        secondary: "#4edea3",
        "secondary-container": "#00a572",
        "on-secondary": "#003824",
        tertiary: "#ddb7ff",
        "tertiary-container": "#b76dff",
        "on-tertiary": "#490080",
        error: "#ffb4ab",
        outline: "#8c909f",
        "outline-variant": "#424754",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        full: "9999px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "code-sm": ["13px", { lineHeight: "20px" }], // Used for code blocks
      }
    },
  },
  plugins: [],
}
