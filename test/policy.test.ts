import { describe, expect } from 'vitest'
import { Policy } from '../src/policy'

describe('policy', it => {

  it('one directive, one source', () => {
    const policy = new Policy()
      .add('default-src', 'https://example.com')
    expect(policy.toString()).toBe('default-src https://example.com')
  })

  it('removes sources', () => {
    const policy = new Policy()
      .add('script-src', 'none', 'self', 'https://example.com')
    expect(policy.toString()).toBe("script-src 'none' 'self' https://example.com")

    policy.remove('script-src', 'none')
    expect(policy.toString()).toBe("script-src 'self' https://example.com")

    policy.remove('script-src', 'https://example.com')
    expect(policy.toString()).toBe("script-src 'self'")
  })

  it('removes directive', () => {
    const policy = new Policy()
      .add('script-src', 'none')
    expect(policy.toString()).toBe("script-src 'none'")

    policy.remove('script-src')
    expect(policy.toString()).toBe("")
  })

  it('removes directive if no source', () => {
    const policy = new Policy()
      .add('script-src', 'none')
    expect(policy.toString()).toBe("script-src 'none'")
    policy.remove('script-src', 'none')
    expect(policy.toString()).toBe("")
  })


  it('multiple directives', () => {
    const policy = new Policy()
      .add('default-src', 'https://alice.com')
      .add('script-src', '*')
    expect(policy.toString()).toBe('default-src https://alice.com; script-src *')
  })

  it('remove duplicated values', () => {
    const policy = new Policy()
      .add('default-src', 'self')
      .add('default-src', 'self', 'https:')
    expect(policy.toString()).toBe("default-src 'self' https:")
  })

  it('should quote static sources', () => {
    const policy = new Policy()
      .add('default-src', 'none')
    expect(policy.toString()).toBe("default-src 'none'")
  })

  it('should quote nonce and sha256 sources', () => {
    const policy = new Policy()
      .add('default-src', 'sha256-abc')
      .add('default-src', 'nonce-123')
    expect(policy.toString()).toBe("default-src 'sha256-abc' 'nonce-123'")
  })

  it('add sandbox values', () => {
    const policy = new Policy()
      .add('default-src', 'none')
      .addSandbox('allow-forms', 'allow-popups')
    expect(policy.toString()).toBe("default-src 'none'; sandbox allow-forms allow-popups")
  })

  it('returns with header name', () => {
    const policy = new Policy().add('default-src', 'none')
    const [headerName, headerValue] = policy.toHeader()

    expect(headerName).toBe('Content-Security-Policy')
    expect(headerValue).toBe("default-src 'none'")
  })

  it('merge multiple policies', () => {
    const gaPolicy = new Policy()
      .add('script-src', 'https://google-analytics.com')
    const clarityPolicy = new Policy()
      .add('script-src', 'https://*.clarity.ms')

    const main = new Policy()
      .add('default-src', 'none')
      .merge(gaPolicy, clarityPolicy)

    expect(main.toString()).toBe("default-src 'none'; script-src https://google-analytics.com https://*.clarity.ms")
  })

  it('with nonce', () => {
    const policy = new Policy()
      .add('script-src', 'self')
      .add('style-src', 'self')
    const withNonce = policy.injectNonce()

    expect(withNonce('123')).toBe("script-src 'self' 'nonce-123'; style-src 'self' 'nonce-123'")


    const withNonceScriptOnly = new Policy().injectNonce({ style: false })
    expect(withNonceScriptOnly('abc')).toBe("script-src 'nonce-abc'")
  })

  it('reports uri and group', () => {
    const uriPolicy = new Policy().add('default-src', 'none').reportUri('/csp-report')
    expect(uriPolicy.toString()).toBe("default-src 'none'; report-uri /csp-report")

    const toPolicy = new Policy().add('default-src', 'none').reportTo('group-name')
    expect(toPolicy.toString()).toBe("default-src 'none'; report-to group-name")
  })

  it('block mixed content', () => {
    const policy = new Policy()
      .add('script-src', 'self')
      .blockAllMixedContent()

    expect(policy.toString()).toBe("script-src 'self'; block-all-mixed-content")
  })
})
