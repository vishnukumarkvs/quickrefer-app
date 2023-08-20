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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no, orientation=landscape"
        />
      </head>
      <body className={`bg-[#fbf9f0]`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
