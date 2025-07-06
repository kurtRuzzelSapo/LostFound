module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebarG: "#31C358",
        "findit-green": "#31C358",
      },
    },
    animation: {
      "fade-in-scale": "fade-in-scale 0.3s cubic-bezier(0.4,0,0.2,1) forwards",
    },
  },
  plugins: [],
};
