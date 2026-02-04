import type { Config } from "tailwindcss";

export default {
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
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Happy Pastel Palette
        "baby-blue": "hsl(var(--baby-blue))",
        cream: "hsl(var(--cream))",
        "soft-peach": "hsl(var(--soft-peach))",
        "pink-pastel": "hsl(var(--pink-pastel))",
        lavender: "hsl(var(--lavender))",

        // Division Colors
        wakahim: "hsl(var(--wakahim))",
        sekretaris: "hsl(var(--sekretaris))",
        bendahara: "hsl(var(--bendahara))",
        personalia: "hsl(var(--personalia))",
        ekraf: "hsl(var(--ekraf))",
        psdm: "hsl(var(--psdm))",
        mikat: "hsl(var(--mikat))",
        sosma: "hsl(var(--sosma))",
        rnd: "hsl(var(--rnd))",
        medinfo: "hsl(var(--medinfo))",

        // WhatsApp
        whatsapp: "hsl(var(--whatsapp))",
        "whatsapp-pastel": "hsl(var(--whatsapp-pastel))",

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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
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
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        robotIdle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        
        // --- KEYFRAMES LAMA (Premium Effects Maskot) ---
        "spin-reverse": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
        "breathe-blue": {
          "0%, 100%": { borderColor: "#60a5fa", boxShadow: "0 0 15px rgba(96, 165, 250, 0.3)" },
          "50%": { borderColor: "#bfdbfe", boxShadow: "0 0 30px rgba(191, 219, 254, 0.6)" },
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateX(55px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(55px) rotate(-360deg)" },
        },
        "ripple-smooth": {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },

        // --- KEYFRAME BARU (Moving Blobs Background) ---
        "blob-bounce": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 8s ease-in-out infinite",
        "robot-idle": "robotIdle 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",

        // --- ANIMASI MASKOT ---
        "spin-slow": "spin 8s linear infinite", 
        "spin-slower": "spin 15s linear infinite",
        "spin-reverse-slow": "spin-reverse 10s linear infinite",
        "breathe-blue": "breathe-blue 4s ease-in-out infinite",
        "orbit": "orbit 2s linear infinite",
        "ripple-1": "ripple-smooth 2s cubic-bezier(0, 0.2, 0.8, 1) infinite",
        "ripple-2": "ripple-smooth 2s cubic-bezier(0, 0.2, 0.8, 1) infinite 1s",

        // --- ANIMASI BARU (Moving Blobs Background) ---
        "blob-slow": "blob-bounce 7s infinite ease-in-out",
        "blob-slower": "blob-bounce 12s infinite ease-in-out",
        "blob-slowest": "blob-bounce 15s infinite ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;