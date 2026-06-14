import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F8F8", // Licious uses off-white background
        foreground: "#212121", // Dark text
        brand: {
          DEFAULT: "#D11243", // Licious Red
          light: "#E83A64",
          dark: "#A50D34",
        },
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
