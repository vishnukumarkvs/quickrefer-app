// app/layout.tsx
import Provider from "@/components/Providers";
import "./globals.css";
//poppins import
import { poppins } from "@/lib/fonts";

export const metadata = {
  title: "Referral Hub",
  description: "Seamlessly request and provide referrals !!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-[#fbf9f0] ${poppins.className}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
