import { Inter, Rajdhani, Poppins } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-rajdhani",
});
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Tut
// https://youtu.be/cKUJdmkEJOQ
