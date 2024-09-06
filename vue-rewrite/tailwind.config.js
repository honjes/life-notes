/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      minHeight: {
        112: "24rem",
        116: "27rem",
        120: "30rem",
        124: "33rem",
        128: "36rem",
        132: "39rem",
        136: "42rem",
        140: "45rem",
      },
    },
  },
  plugins: [],
}
