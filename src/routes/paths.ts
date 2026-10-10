/**
 * Single source of truth for URLs. Components link through these helpers
 * instead of hardcoding path strings.
 */
export const ROUTES = {
  home: '/',
  services: '/services',
  serviceDetail: '/services/:serviceSlug',
  knowledgeCentre: '/knowledge-centre',
  articleDetail: '/knowledge-centre/articles/:slug',
  careers: '/careers',
  company: '/company',
  contact: '/contact',
  privacyPolicy: '/privacy-policy',
  termsOfService: '/terms-of-service',
  securityDisclosure: '/security-disclosure',
  // Admin Portal
  admin: '/admin',
  adminLogin: '/admin/login',
  adminApplications: '/admin/applications',
  adminApplicationDetail: '/admin/applications/:id',
  adminMessages: '/admin/messages',
  adminMessageDetail: '/admin/messages/:id',
  adminVideos: '/admin/videos',
  adminVideoNew: '/admin/videos/new',
  adminVideoEdit: '/admin/videos/:id/edit',
} as const

export const serviceDetailPath = (serviceSlug: string) => `/services/${serviceSlug}`

export const articleDetailPath = (slug: string) => `/knowledge-centre/articles/${slug}`

export const adminApplicationDetailPath = (id: string) => `/admin/applications/${id}`

export const adminMessageDetailPath = (id: string) => `/admin/messages/${id}`

export const adminVideoEditPath = (id: string) => `/admin/videos/${id}/edit`
