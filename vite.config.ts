import path from "path";

import { defineConfig } from "vite";
import eslintPlugin from "@nabla/vite-plugin-eslint";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [
        react(), 
        eslintPlugin({
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
        })
    ],
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
    resolve: {
        alias: {
            "@ui": path.resolve(__dirname, "./src/ui"),
            "@styles": path.resolve(__dirname, "./src/styles/src"),
        },
    }
}));
