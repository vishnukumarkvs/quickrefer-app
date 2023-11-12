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
        <link rel="canonical" href="https://www.quickrefer.in" />
        <meta property="og:title" content={"QuickRefer"} />
        <meta property="og:url" content={"quickrefer.in"} />
        <meta property="og:type" content={"Website"} />
        <meta property="og:site_name" content={"QuickRefer"} />
        <meta
          name="keywords"
          content="QuickRefer, quickrefer, quickrefer.in, QuickRefer, Referrals, Refer, Online Referral, Referral site, Job, Jobs in India, IT, Software"
        />
        <meta property="og:locale" content={"en_IN"} />
        <meta property="og:image:width" content={"512"} />
        <meta property="og:image:height" content={"512"} />
        <meta property="og:image:type" content={"image/png"} />
        <meta property="og:image:alt" content={"QuickRefer"} />
        <meta property="og:image" content={"/android-chrome-512x512.png"} />
        <meta
          property="og:image:secure_url"
          content="https://www.quickrefer.in/android-chrome-512x512.png"
        />
        <meta
          property="og:description"
          content={
            "Quickrefer.in: Get instant referrals & elevate Your Career: Unlock Job Opportunities with Personal Referrals"
          }
        />
        <meta
          name="description"
          content={
            "Quickrefer.in: Get instant referrals & elevate Your Career: Unlock Job Opportunities with Personal Referrals"
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
