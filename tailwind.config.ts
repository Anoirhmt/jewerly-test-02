import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
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
        'luxury-cream': '#F9F7F5',
        'luxury-cream-dark': '#F2EEE8',
        'luxury-gold': '#C9A96E',
        'luxury-gold-light': '#E8D5B0',
        'luxury-gray': '#F5F4F2',
        'luxury-charcoal': '#1C1C1E',
        'brand': '#9b5c5c',
        'brand-light': '#f7f0f0',
        'brand-muted': 'rgba(155,92,92,0.12)',
      },
      boxShadow: {
        'luxury': '0 8px 32px -8px rgba(0, 0, 0, 0.06)',
        'luxury-hover': '0 24px 64px -16px rgba(0, 0, 0, 0.10)',
        'luxury-deep': '0 40px 80px -20px rgba(0, 0, 0, 0.14)',
        'soft': '0 2px 12px rgba(0, 0, 0, 0.03)',
        'brand': '0 8px 32px -8px rgba(155, 92, 92, 0.2)',
        'brand-hover': '0 16px 48px -12px rgba(155, 92, 92, 0.3)',
        'glass': '0 4px 24px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      fontSize: {
        'luxury-xs': ['0.6rem', { letterSpacing: '0.4em', lineHeight: '1.6' }],
        'luxury-sm': ['0.7rem', { letterSpacing: '0.35em', lineHeight: '1.6' }],
        'luxury-base': ['0.8rem', { letterSpacing: '0.25em', lineHeight: '1.7' }],
        'luxury-md': ['clamp(1.8rem, 4vw, 3.5rem)', { letterSpacing: '0.08em', lineHeight: '1.2' }],
        'luxury-lg': ['clamp(2.5rem, 6vw, 5rem)', { letterSpacing: '0.06em', lineHeight: '1.1' }],
      },
      letterSpacing: {
        'luxury': '0.15em',
        'luxury-lg': '0.3em',
        'luxury-xl': '0.5em',
      },
      lineHeight: {
        'relaxed-extra': '1.8',
        'luxury': '1.4',
      },
      transitionDuration: {
        '1100': '1100ms',
        '1200': '1200ms',
        '1500': '1500ms',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "draw-line": {
          from: { width: "0" },
          to: { width: "3rem" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s cubic-bezier(0.22,1,0.36,1)",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "marquee": "marquee 30s linear infinite",
        "shimmer": "shimmer 1.5s infinite",
        "draw-line": "draw-line 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
