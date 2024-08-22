const srcDirectives = [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'connect-src',
  'font-src',
  'object-src',
  'media-src',
  'frame-src',
  'child-src',
  'worker-src',
  'manifest-src',
  'prefetch-src',
  'form-action',
  'frame-ancestors',
  'base-uri',
] as const

type SrcDirective = typeof srcDirectives[number]

type Source =
  | '*'
  | 'none'
  | 'self'
  | 'data:'
  | 'https:'
  | 'unsafe-inline'
  | 'unsafe-eval'
  | 'strict-dynamic'
  | 'unsafe-hashes'
  | `'sha256-${string}'`
  | `'nonce-${string}'`
  | (string & {})

const sandboxValues = [
  'allow-forms',
  'allow-same-origin',
  'allow-scripts',
  'allow-popups',
  'allow-modals',
  'allow-orientation-lock',
  'allow-pointer-lock',
  'allow-presentation',
  'allow-popups-to-escape-sandbox',
  'allow-top-navigation',
] as const

type SandboxValue = typeof sandboxValues[number]

const shouldQuoteRegex = /^(none|self|unsafe-inline|unsafe-eval|strict-dynamic|unsafe-hashed|sha(256|384|512)-.+|nonce-.+)$/

function shouldQuote(source: Source) {
  return shouldQuoteRegex.test(source)
}

export class Policy {
  readonly srcDirectives: Map<SrcDirective, Set<Source>> = new Map()
  readonly sandbox: Set<SandboxValue> = new Set()

  #reportUri = ''
  #reportTo = ''
  #blockAllMixed = false

  add(directive: SrcDirective, ...sources: Source[]) {
    if (!this.srcDirectives.has(directive)) {
      this.srcDirectives.set(directive, new Set())
    }

    const sourceValues = this.srcDirectives.get(directive)!
    sources.forEach(source => {
      sourceValues.add(shouldQuote(source) ? `'${source}'` : source)
    })
    return this
  }

  addSandbox(...values: SandboxValue[]) {
    values.forEach(value => {
      this.sandbox.add(value)
    })
    return this
  }

  reportUri(uri: string) {
    this.#reportUri = uri
    return this
  }

  reportTo(group: string) {
    this.#reportTo = group
    return this
  }

  blockAllMixedContent() {
    this.#blockAllMixed = true
    return this
  }

  injectNonce(options?: { script?: boolean, style?: boolean }) {
    const opts = Object.assign({}, { script: true, style: true }, options)

    opts.script && this.add('script-src', 'nonce-<nonce>')
    opts.style && this.add('style-src', 'nonce-<nonce>')

    const str = this.toString()

    return (nonce: string) => {
      return str.replaceAll('nonce-<nonce>', `nonce-${nonce}`)
    }
  }

  merge(...policies: Policy[]) {
    policies.forEach(policy => {
      policy.srcDirectives.forEach((sources, directive) => {
        this.add(directive, ...Array.from(sources))
      })
      policy.sandbox.forEach(value => {
        this.addSandbox(value)
      })
    })
    return this
  }

  // stringify

  private blockAllMixedContentString() {
    if (!this.#blockAllMixed) {
      return ''
    }
    return 'block-all-mixed-content'
  }

  private sandboxString() {
    if (this.sandbox.size === 0) {
      return ''
    }
    return `sandbox ${Array.from(this.sandbox).join(' ')}`
  }

  private reportUriString() {
    if (!this.#reportUri) {
      return ''
    }
    return `report-uri ${this.#reportUri}`
  }

  private reportToString() {
    if (!this.#reportTo) {
      return ''
    }
    return `report-to ${this.#reportTo}`
  }

  toString() {
    const srcDirectives = Array.from(this.srcDirectives.entries())
      .map(([directive, sources]) => {
        return `${directive} ${Array.from(sources).join(' ')}`
      })

    return [
      ...srcDirectives,
      this.sandboxString(),
      this.reportUriString(),
      this.reportToString(),
      this.blockAllMixedContentString(),
    ].filter(Boolean).join('; ')
  }

  toHeader() {
    return ['Content-Security-Policy', this.toString()]
  }
}
