import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Create the ESLint configuration by extending Next.js defaults
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Custom rules or overrides can go here
      "quotes": ["error", "double", { "allowTemplateLiterals": true }],  // Enforce double quotes
      "semi": ["error", "always"],  // Enforce semicolons at the end of every statement
      "indent": ["error", 2], // Use 2 spaces for indentation
      "no-tabs": ["error", { allowIndentationTabs: true }], // Allow tabs for indentation
      "react/jsx-indent": ["error", 2], // Enforce 2 spaces for JSX indentation
      "react/jsx-indent-props": ["error", 2], // Enforce 2 spaces for JSX props indentation
      "space-before-blocks": ["error", "always"], // Ensure space before blocks (functions, conditionals, etc.)
      "no-mixed-spaces-and-tabs": ["error", "smart-tabs"], // Prevent mixing spaces and tabs
      "react/prop-types": "off", // If using TypeScript, we can turn off prop-types
    },
  },
];

export default eslintConfig;
