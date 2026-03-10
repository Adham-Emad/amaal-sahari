import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('fs', () => {
  return {
    default: {
      existsSync: vi.fn(() => false),
      readFileSync: vi.fn(() => '{}'),
    },
    existsSync: vi.fn(() => false),
    readFileSync: vi.fn(() => '{}'),
  }
})

describe('Metadata builder', () => {
  it('builds metadata with defaults when no content exists', async () => {
    const { buildMetadata } = await import('../../lib/metadata')
    const meta = buildMetadata({ path: '/' })
    expect(meta.title).toBeTruthy()
    expect(meta.description).toBeTruthy()
    expect(meta.openGraph).toBeDefined()
    expect(meta.twitter).toBeDefined()
  })

  it('builds metadata with overrides', async () => {
    const { buildMetadata } = await import('../../lib/metadata')
    const meta = buildMetadata({
      title: 'Custom Title',
      description: 'Custom Description',
      keywords: 'test, keywords',
      path: '/test',
    })
    expect(meta.title).toBe('Custom Title')
    expect(meta.description).toBe('Custom Description')
    expect(meta.keywords).toBe('test, keywords')
  })

  it('includes OpenGraph properties', async () => {
    const { buildMetadata } = await import('../../lib/metadata')
    const meta = buildMetadata({
      title: 'OG Test',
      description: 'OG Description',
      ogImage: '/test-image.jpg',
      path: '/og-test',
    })
    expect(meta.openGraph).toBeDefined()
    expect(meta.openGraph?.title).toBe('OG Test')
  })

  it('getGlobalMetadata returns valid metadata', async () => {
    const { getGlobalMetadata } = await import('../../lib/metadata')
    const meta = getGlobalMetadata()
    expect(meta.title).toBeTruthy()
    expect(meta.openGraph).toBeDefined()
  })
})
