import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        oatmeal: "#F4ECE1",
        coffee: "#8A6246",
        latte: "#D8B08C",
        sage: "#7F9B8A",
        moss: "#3A8F6A",
        clay: "#C77D2D",
        ink: "#232323",
        muted: "#6F6A64",
        line: "#ECE2D8",
        lilac: "#7C6CF2"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(78, 54, 35, 0.10)",
        lift: "0 12px 30px rgba(80, 57, 40, 0.13)"
      },
      fontFamily: {
        sans: [
          '"LXGW WenKai Screen"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
} satisfies Config;
