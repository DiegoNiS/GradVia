/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: "#121212", // Pure dark monochrome background
        surface: "#181818",    // Soft neumorphic surface
        border: "#262626",     // Subtle monochrome border
        foreground: "#f4f4f5", // Bright text
        muted: "#a1a1aa",      // Secondary text
        accent: {
          DEFAULT: "#ffffff",  // Monochrome primary highlight
          hover: "#e4e4e7",
        },
      },
      boxShadow: {
        // Custom Neumorphic shadows for dark mode monochrome
        'neu-raised': '6px 6px 14px rgba(0,0,0,0.8), -5px -5px 12px rgba(255,255,255,0.04)',
        'neu-raised-sm': '3px 3px 8px rgba(0,0,0,0.7), -3px -3px 7px rgba(255,255,255,0.04)',
        'neu-inset': 'inset 4px 4px 8px rgba(0,0,0,0.8), inset -4px -4px 8px rgba(255,255,255,0.03)',
        'neu-inset-sm': 'inset 2px 2px 5px rgba(0,0,0,0.7), inset -2px -2px 5px rgba(255,255,255,0.03)',
      }
    },
  },
  plugins: [],
}
