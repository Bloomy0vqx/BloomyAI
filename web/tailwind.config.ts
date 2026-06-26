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
        'bloomy-purple': '#8B5CF6',
        'bloomy-pink': '#EC4899',
        'bloomy-blue': '#3B82F6',
        'dark-bg': '#13151C',
        'dark-surface': '#1E222B',
        'dark-card': '#252A35',
        'dark-border': '#2D3344',
        'dark-text': '#F0F2F8',
        'dark-text-secondary': '#8892A4',
      },
    },
  },
  plugins: [],
};

export default config;
