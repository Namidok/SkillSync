/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#3B82F6",
        "accent-hover": "#2563EB",
        surface: "#111318",
        card: "#1a1d27",
        border: "#2d3748",
        muted: "#4a5568",
        subtle: "#a0aec0",
      },
    },
  },
  plugins: [],
}