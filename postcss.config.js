// This configuration is updated to use ES Module syntax (export default)
// to resolve the "module is not defined" error in an ES module project.

export default {
  plugins: {
    // Standard PostCSS plugin for handling Tailwind CSS directives
    tailwindcss: {},
    // Standard PostCSS plugin for vendor prefixing CSS rules
    autoprefixer: {},
  },
};
