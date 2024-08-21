import { Policy } from "../policy";

// doc: https://developers.google.com/tag-platform/security/guides/csp

export const googleTagManagerPolicy_previewMode = new Policy()
  .add('script-src', 'https://googletagmanager.com', 'https://tagmanager.google.com')
  .add('style-src', 'https://googletagmanager.com', 'https://tagmanager.google.com', 'https://fonts.googleapis.com')
  .add('img-src', 'https://googletagmanager.com', 'https://ssl.gstatic.com', 'https://www.gstatic.com')
  .add('font-src', 'data:', 'https://fonts.gstatic.com')

export const googleTagManagerPolicy_unsafe = new Policy()
  .add('script-src', 'unsafe-inline', 'https://www.googletagmanager.com')
  .add('img-src', 'www.googletagmanager.com')
  .add('connect-src', 'www.googletagmanager.com')
