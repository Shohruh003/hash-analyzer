/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: {
                    DEFAULT: "#0a1410",
                    surface: "#0f1f17",
                    elevated: "#152a20",
                },
                accent: {
                    DEFAULT: "#10b981",
                    glow: "#34d399",
                },
                success: "#22c55e",
                danger: "#f43f5e",
                warning: "#facc15",
            },
            fontFamily: {
                mono: ["JetBrains Mono", "Consolas", "monospace"],
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            animation: {
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
            },
            keyframes: {
                "pulse-glow": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.6" },
                },
            },
        },
    },
    plugins: [],
};
