import { Policy } from "../policy";

// doc: https://developers.facebook.com/docs/meta-pixel/advanced/

export const metaPixelPolicy_loose = new Policy()
  .add('script-src', 'https://connect.facebook.net')

export const metaPixelPolicy_strict = new Policy()
  .add('script-src', 'https://connect.facebook.net/en_US/fbevents.js', 'https://connect.facebook.net/signals/config/')
