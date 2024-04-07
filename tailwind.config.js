/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.tsx", "./index.html"],
    theme: {
        extend: {},
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("daisyui"),
    ],
    daisyui: {
        themes: [
            //{
            //    "crabby": {
            //        "primary": "#dc2626",
            //        "secondary": "#fed7aa",
            //        "accent": "#78716c",
            //        "neutral": "#f3f4f6",
            //        "base-100": "#181a1b",
            //        "info": "#292524",
            //        "success": "#d97706",
            //        "warning": "#57534e",
            //        "error": "#e7e5e4",
            //    }
            //},
            {
                "crabby": {
                    "primary": "#dc2626",
                    "secondary": "#d97706",
                    "accent": "#57534e",
                    "neutral": "#1d1e1f",
                    "base-100": "#181a1b",
                    "info": "#44403c",
                    "success": "#1e3a8a",
                    "warning": "#eab308",
                    "error": "#991b1b",
                }
            }
        ], 
        darkTheme: "dark", // name of one of the included themes for dark mode
        base: true, // applies background color and foreground color for root element by default
        styled: true, // include daisyUI colors and design decisions for all components
        utils: true, // adds responsive and modifier utility classes
        prefix: "d-", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
        themeRoot: ":root", // The element that receives theme color CSS variables
    },
}

