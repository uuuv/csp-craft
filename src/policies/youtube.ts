import { Policy } from "../policy";

export const youtubeEmbedPolicy = new Policy()
  .add('frame-src', 'https://youtube/embed/')


export const youtubeNoCookieEmbedPolicy = new Policy()
  .add('frame-src', 'https://www.youtube-nocookie.com/embed/')

