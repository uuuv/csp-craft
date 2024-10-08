# CSP Craft

A simple way to build Content-Security-Policy.

## Installation

```sh
npm install csp-craft
```

```sh
yarn add csp-craft
```

```sh
pnpm add csp-craft
```

## Features

- [x] Merge multiple policies
- [x] Automatically add single quotes for `'self'` and `'nonce-123'`, etc.
- [x] Unique source values
- [x] Prebuild for nonce

## Getting Started

### Basic

```js
import { Policy } from 'csp-craft'

const policy = new Policy()
  .add('default-src', 'none')
  .add('script-src', 'self')

policy.toString()
// default-src 'none'; script-src: 'self'
```

### Merge multiple policies

```js
import { Policy } from 'csp-craft'

const p1 = new Policy()
  .add('script-src', 'https://p1.com')

const p2 = new Policy()
  .add('script-src', 'https://p2.com')

const mainPolicy = new Policy()
  .add('default-src', 'none')
  .add('script-src', 'self')
  .merge(p1, p2)

mainPolicy.toString()
// default-src 'none'; script-src: 'self' https://p1.com https://p2.com
```

### Built-in policies

See `src/policies`.

- google tag manager

// TODO: add all builtin policies

### Inject nonce

```js
import { Policy } from 'csp-craft'

const p1 = new Policy()
  .add('script-src', 'https://p1.com')

const cspWithNonce = p1.injectNonce()

cspWithNonce('123')
// script-src https://p1.com 'nonce-123'
```

