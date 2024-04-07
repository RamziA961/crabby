import path from "path";

import { defineConfig } from "vite";
import eslintPlugin from "@nabla/vite-plugin-eslint";
import react from "@vitejs/plugin-react";
import { ESLint } from "eslint";
import svgr from "vite-plugin-svgr";

export default defineConfig(async () => ({
    plugins: [
        react(), 
        eslintPlugin(eslintConfig),
        svgr(),
    ],
    resolve: {
        alias: {
            "@ui": path.resolve(__dirname, "./src/ui/"),
            "@styles": path.resolve(__dirname, "./src/styles/"),
            "@models": path.resolve(__dirname, "./src/models/"),
            "@assets": path.resolve(__dirname, "./src/assets/"),
        },
    },

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"],
        },
    },
}));

const eslintConfig: {
    eslintOptions?: ESLint.Options;
    shouldLint?: (path: string) => boolean;
    formatter?: string | ((result: ESLint.LintResult) => void);
} = {
    eslintOptions: {
        cache: false,
        overrideConfig: {
            parser: "@typescript-eslint/parser",
            parserOptions: {
                sourceType: "module",
                ecmaVersion: 2020,
                ecmaFeatures: {
                    jsx: true,
                },
            },
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
                "plugin:react/recommended",
                "plugin:react-hooks/recommended",
            ],
            plugins: [
                "@stylistic/ts",
                "@stylistic/jsx",
                "@typescript-eslint",
                "react",
                "react-hooks"
            ],
            ignorePatterns: ["src-tauri/**", "node_modules/**", "dist/**"],
            rules: {
                semi: ["warn", "always"],
                quotes: ["warn", "double"],
                "react/react-in-jsx-scope": "off"
            }
        }
    },
};

