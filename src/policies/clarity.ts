// doc: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-csp

import { Policy } from "../policy";

export const clarityPolicy = new Policy()
  .add('default-src', 'self', 'https://*.clarity.ms', 'https://c.bing.com', 'unsafe-inline')
