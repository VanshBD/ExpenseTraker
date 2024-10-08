module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1A73E8", // Custom primary color (a nice blue)
        secondary: "#FFC107", // Custom secondary color (warm yellow)
        accent: "#FF5722", // Accent color for elements (vibrant orange)
        background: "#121212", // Dark background color for sleek design
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Clean modern font
        mono: ["Fira Code", "monospace"], // Good for code or techy feel
      },
      boxShadow: {
        glow: "0 0 15px rgba(255, 255, 255, 0.6)", // Soft glow effect
      },
      borderRadius: {
        'lg': '20px', // Rounded corners for elements like cards
      },
      spacing: {
        '128': '32rem', // For extra large containers or sections
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Improves text readability
    require('@tailwindcss/forms'), // Better form styling
    require('@tailwindcss/aspect-ratio'), // For responsive image handling
  ],
};
