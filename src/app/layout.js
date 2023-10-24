import Provider from "@/components/Providers";
import "./globals.css";

// export const metadata = {
//   title: "QuickRefer",
//   description:
//     "Get instant referrals & elevate Your Career: Unlock Job Opportunities with Personal Referrals",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>QuickRefer</title>
        <meta property="og:title" content={"QuickRefer"} />
        <meta property="og:url" content={"quickrefer.in"} />
        <meta
          name="description"
          content={
            "Get instant referrals & elevate Your Career: Unlock Job Opportunities with Personal Referrals"
          }
        />
        <meta
          property="og:description"
          content={
            "Get instant referrals & elevate Your Career: Unlock Job Opportunities with Personal Referrals"
          }
        />
        <meta name="twitter:site" content={`@quickrefer`} />
        {/* <meta
          name="twitter:card"
          content={image ? "summary_large_image" : "summary"}
        /> */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta property="og:image" content={"/android-chrome-512x512.png"} />
        <meta name="theme-color" content="#ffcd18" />
      </head>
      <body className={`bg-[#fbf9f0]`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
