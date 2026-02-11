/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0B",
        pearl: "#F6F6F6",
        gold: "#C8A951"
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 10px 40px rgba(200, 169, 81, 0.18)",
        soft: "0 12px 40px rgba(0, 0, 0, 0.2)",
        card: "0 22px 60px rgba(0, 0, 0, 0.28)"
      },
      letterSpacing: {
        luxe: "0.18em"
      },
      backgroundImage: {
        "ink-gradient": "radial-gradient(1200px circle at 10% 10%, rgba(200, 169, 81, 0.08), transparent 55%), radial-gradient(900px circle at 90% 20%, rgba(200, 169, 81, 0.04), transparent 60%), linear-gradient(180deg, #0B0B0B 0%, #070707 100%)"
      },
      keyframes: {
        shimmer: {
          "0%": { opacity: "0.5" },
          "50%": { opacity: "0.95" },
          "100%": { opacity: "0.5" }
        },
        slowPulse: {
          "0%": { opacity: "0.35" },
          "50%": { opacity: "0.8" },
          "100%": { opacity: "0.35" }
        }
      },
      animation: {
        shimmer: "shimmer 2.6s ease-in-out infinite",
        slowPulse: "slowPulse 2.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};





