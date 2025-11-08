import eslintPluginPrettier from "eslint-plugin-prettier";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    // 🔹 Tell ESLint which files/folders to ignore
    ignores: [
      "node_modules",
      "dist",
      "build",
      "coverage",
      "logs",
      "*.log",
      ".vscode",
      ".env",
      "docker-compose*.yml",
      "Dockerfile",
      "tests/**/*.js",
      "tests/**/*.ts",
    ],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json", // ✅ Optional: enables type-aware linting
      },
      globals: {
        ...globals.node,
        ...globals.es2021, // ✅ Modern JS globals (like `Promise`, `fetch`, etc.)
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // ✅ TypeScript best practices
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],

      // ✅ Prettier formatting enforcement
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          singleQuote: true,
          trailingComma: "all",
          printWidth: 100,
        },
      ],

      // ✅ General JS hygiene
      "no-console": "off", // You can set to 'warn' for production
      "no-debugger": "warn",
    },
  },
];
