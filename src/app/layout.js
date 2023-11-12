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
        <meta property="og:url" content={"https://www.quickrefer.in"} />
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
        <meta
          property="og:image"
          content={"https://www.quickrefer.in/android-chrome-512x512.png"}
        />
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
        {/* <meta name="twitter:site" content={`@quickrefer`} /> */}
        <meta
          itemprop="thumbnailUrl"
          content="https://www.quickrefer.in/android-chrome-512x512.png"
        />
        <link
          rel="image_src"
          href="https://www.quickrefer.in/android-chrome-512x512.png"
        />
        <meta
          itemprop="image"
          content="https://www.quickrefer.in/android-chrome-512x512.png"
        />
        <meta name="twitter:url" content="https://www.quickrefer.in" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QuickRefer" />
        <meta
          name="twitter:description"
          content="Quickrefer.in: Get instant referrals & elevate Your Career: Unlock Job Opportunities with Personal Referrals"
        />
        <meta
          name="twitter:image"
          content="https://www.quickrefer.in/android-chrome-512x512.png"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://www.quickrefer.in/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://www.quickrefer.in/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://www.quickrefer.in/favicon-16x16.png"
        />
        <link
          rel="manifest"
          href="https://www.quickrefer.in/site.webmanifest.json"
        />
        <link rel="icon" href="https://www.quickrefer.in/favicon.ico" />
        <meta name="theme-color" content="#ffcd18" />
      </head>
      <body className={`bg-[#fbf9f0]`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
