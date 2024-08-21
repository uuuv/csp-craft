import { Policy } from "../policy";

// doc: https://help.hotjar.com/hc/en-us/articles/115011640307-Content-Security-Policies

export const hotjarPolicy_DefaultSrcOnly = new Policy()
  .add('default-src', 'https://*.hotjar.com', 'https://*.hotjar.io', 'wss://*.hotjar.com', 'unsafe-inline')

export const hotjarPolicy_loose = new Policy()
  .add('img-src', 'https://*.hotjar.com')
  .add('script-src', 'https://*.hotjar.com', 'unsafe-inline')
  .add('connect-src', 'https://*.hotjar.com', 'https://*.hotjar.io', 'wss://*.hotjar.com')
  .add('font-src', 'https://*.hotjar.com')
  .add('style-src', 'https://*.hotjar.com', 'unsafe-inline')

export const hotjarPolicy_strict = new Policy()
  .add('img-src', 'https://static.hotjar.com', 'https://script.hotjar.com', 'https://survey-images.hotjar.com')
  .add('script-src', 'https://static.hotjar.com', 'https://script.hotjar.com', 'unsafe-inline')
  .add('connect-src', 'https://*.hotjar.com', 'https://*.hotjar.io', 'wss://*.hotjar.com')
  .add('font-src', 'https://script.hotjar.com')
  .add('style-src', 'https://static.hotjar.com', 'https://script.hotjar.com', 'unsafe-inline')
