import localFont from "next/font/local";

export const manrope = localFont({
  src: [
    {
      path: "../public/fonts/manrope-variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});
