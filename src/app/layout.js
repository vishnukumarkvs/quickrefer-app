// app/layout.tsx
import Provider from "@/components/Providers";
import "./globals.css";

export const metadata = {
  title: "Referral Hub",
  description: "Seamlessly request and provide referrals !!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-[#fbf9f0]`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
