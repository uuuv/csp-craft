import { Policy } from "../policy";

// doc: https://developers.google.com/tag-platform/security/guides/csp#google_analytics_4_google_analytics

export const googleAnalyticsPolicy = new Policy()
  .add('script-src', 'https://*.googletagmanager.com')
  .add('img-src', 'https://*.google-analytics.com', 'https://*.googletagmanager.com')
  .add('connect-src', 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com')
