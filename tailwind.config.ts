import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pattensBlue: "var(--pattensBlue)",
        summerSky: "var(--summerSky)",
        codGrey: "var(--codGrey)",
        slateGrey: "var(--slateGrey)",
        blueCharcoal: "var(--blueCharcoal)",

        grassGreen: "var(--grassGreen)",
        mayaBlue: "var(--mayaBlue)",
        dodgerBlue: "var(--dodgerBlue)",
        dodgerBlueWith25Opacity: "var(--dodgerBlueWith25Opacity)",
        electricBlue: "var(--electricBlue)",
        white: "var(--white)",
        whiteSmoke: "var(--whiteSmoke)",
        whisper: "var(--whisper)",
        charcoal: "var(--charcoal)",
        nightRider: "var(--nightRider)",
        black: "var(--black)",
        persianRed: "var(--persianRed)",
        bloodred: "var(--bloodred)",
        gympoolBlue: "var(--gympoolBlue)",
        bloodredWith25Opacity: "var(--bloodredWith25Opacity)",
        pink: "var(--pink)",
        sunflower: "var(--sunflower)",
        chestnut: "var(--chestnut)",
        navyBlue: "var(--navyBlue)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
