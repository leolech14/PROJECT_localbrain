/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // APCA-verified OKLCH colors
      colors: {
        bg1: "var(--bg1)",
        bg2: "var(--bg2)",
        bg3: "var(--bg3)",
        bg4: "var(--bg4)",
        surface: "var(--surface)",
        tx1: "var(--tx1)",
        tx2: "var(--tx2)",
        tx3: "var(--tx3)",
        hair: "var(--hair)",
        acc: "var(--acc)",
        ok: "var(--ok)",
        warn: "var(--warn)",
        err: "var(--err)",
      },
      // Design system spacing (4px/8px grid)
      spacing: {
        xs: "0.25rem",  // 4px
        sm: "0.5rem",   // 8px
        md: "1rem",     // 16px
        lg: "1.5rem",   // 24px
        xl: "2rem",     // 32px
        "2xl": "3rem",  // 48px
        "3xl": "4rem",  // 64px
      },
      // Relative typography
      fontSize: {
        xs: "0.75rem",    // 12px
        sm: "0.875rem",   // 14px
        base: "1rem",     // 16px
        lg: "1.125rem",   // 18px
        xl: "1.25rem",    // 20px
        "2xl": "1.5rem",  // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem",  // 36px
      },
      // WCAG-compliant touch targets
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
      // Focus ring styles (APCA verified)
      outlineWidth: {
        focus: "2px",
      },
      outlineOffset: {
        focus: "2px",
      },
    },
  },
  plugins: [],
};
