import Analytics from "analytics";
import googleAnalytics from "@analytics/google-analytics";

const analytics = Analytics({
  app: "quickrefer",
  plugins: [
    googleAnalytics({
      measurementIds: ["G-YDHK6EQVBH"],
    }),
  ],
});

export default analytics;
