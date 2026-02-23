/* eslint-disable import/no-anonymous-default-export */
// tailwind.config.js
import forms from '@tailwindcss/forms';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    forms,
  ],
};
