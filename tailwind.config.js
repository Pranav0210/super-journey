/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", "class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        primaryIndigo: "#161D6F",
        primaryLight: "#c6d6f7",
        borderGray: "#E0E0E0",
        textGray: "#999999",
        backgroundGray: "#FAFAFA",
        navyLight: "#2B34A5",
        clearSky: "#E1E3F9",
        cloudyBlue: "#ADB1E9",
        primaryBlack: "#3E3E3E",
        secondaryBlack: "#2E2E2E",
        verifiedGreen: "#189B11",
        pantoneGreen: "#497174",
        pantoneLight:"#5B8487",
        lightMint: "#B0D1D4",
        cedarChest:"#C95A49",
        terraCotta:"#E2725B",
        vividTangerine: "#FFA089",
        errorRed: "#A72B2A",
        brightRed: "#E04E39",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        comfortaa: ["Comfortaa", "sans-serif"],
        redRose: ["Red Rose", "sans-serif"],
        yesevaOne: ["Yeseva One", "serif"],
      },
      borderWidth: {
        dashedLarge: "dashed",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        custom: "0px 0px 24px 0px #0000001A",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(-20px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
      },
      screens: {
        xs: "480px",
        sm: "960px",
        md: "1440px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
