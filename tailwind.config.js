/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: {
                    DEFAULT: "#150d1f",
                    surface: "#1f1530",
                    elevated: "#2a1d40",
                },
                accent: {
                    DEFAULT: "#a855f7",
                    glow: "#c084fc",
                },
                success: "#22c55e",
                danger: "#f43f5e",
                warning: "#fb923c",
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
