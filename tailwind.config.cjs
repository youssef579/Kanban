/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    important: true,
    content: ["./src/**/*.tsx", "./index.html"],
    theme: {
        extend: {
            colors: {
                primary: "#635FC7",
                secondary: "#2B2C37",
                border: "#3E3F4E",
                bg: "#20212c",
                "alt-text": "rgb(130, 143, 163)",
                danger: "rgb(234, 85, 85)",
            },
            transitionDuration: {
                DEFAULT: "300ms",
            },
            keyframes: {
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                loading: {
                    to: {
                        opacity: "0.2",
                        transform: "translateY(50px)",
                    },
                },
            },
            animation: {
                "fade-in": "fade-in 300ms forwards",
                loading: "loading 1s infinite alternate",
            },
            fontFamily: {
                sans: ["'Plus Jakarta Sans Variable'", "sans-serif"],
            },
        },
    },
    plugins: [],
};
