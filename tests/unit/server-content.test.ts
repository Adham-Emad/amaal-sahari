import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('fs', () => {
  const mockContent = {
    services: {
      items: [
        { slug: 'test-service', en: { title: 'Test Service', description: 'A test' }, ar: { title: 'خدمة تجريبية', description: 'اختبار' }, imageUrl: '/test.png' },
      ],
    },
    customPages: [
      { slug: 'test-page', status: 'published', en: { title: 'Test Page', subtitle: 'Sub' }, ar: { title: 'صفحة تجريبية', subtitle: '' } },
      { slug: 'draft-page', status: 'draft', en: { title: 'Draft' }, ar: { title: 'مسودة' } },
    ],
    seo: {
      general: { defaultMetaTitle: 'Site Title', defaultMetaDescription: 'Site Desc', metaKeywords: 'key1' },
      pages: [{ slug: 'about', metaTitle: 'About Title', metaDescription: 'About Desc' }],
    },
  }
  return {
    default: {
      existsSync: vi.fn(() => true),
      readFileSync: vi.fn(() => JSON.stringify(mockContent)),
    },
    existsSync: vi.fn(() => true),
    readFileSync: vi.fn(() => JSON.stringify(mockContent)),
  }
})

describe('Server Content', () => {
  it('getServerContent returns parsed content', async () => {
    const { getServerContent } = await import('../../lib/server-content')
    const content = getServerContent()
    expect(content).toBeDefined()
    expect(content.services).toBeDefined()
  })

  it('getServiceBySlug finds existing service', async () => {
    const { getServiceBySlug } = await import('../../lib/server-content')
    const service = getServiceBySlug('test-service')
    expect(service).toBeDefined()
    expect(service?.en?.title).toBe('Test Service')
  })

  it('getServiceBySlug returns null for non-existent', async () => {
    const { getServiceBySlug } = await import('../../lib/server-content')
    const service = getServiceBySlug('nonexistent')
    expect(service).toBeNull()
  })

  it('getCustomPageBySlug finds published page', async () => {
    const { getCustomPageBySlug } = await import('../../lib/server-content')
    const page = getCustomPageBySlug('test-page')
    expect(page).toBeDefined()
    expect(page?.en?.title).toBe('Test Page')
  })

  it('getCustomPageBySlug ignores draft pages', async () => {
    const { getCustomPageBySlug } = await import('../../lib/server-content')
    const page = getCustomPageBySlug('draft-page')
    expect(page).toBeNull()
  })

  it('getPageSEO returns SEO for configured page', async () => {
    const { getPageSEO } = await import('../../lib/server-content')
    const seo = getPageSEO('about')
    expect(seo).toBeDefined()
    expect(seo?.title).toBe('About Title')
  })
})
