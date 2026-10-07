import type { EdgePoint, HeroMedia } from '@/types/home'

/**
 * Hero background. The image is the frame exported from the design.
 *
 * The design source also contains a hero video (`Car.mp4`) that has not been
 * supplied — PLACEHOLDER_ASSET. Once it is in `public/images/home/`, set
 * `video` and the hero will play it over this image.
 */
export const heroMedia: HeroMedia = {
  image: '/images/home/hero-vehicle.jpg',
  width: 1024,
  height: 468,
  video: '/gifs/home.mp4',
}

export const heroIntro =
  'Expert automotive cybersecurity — from TARA and compliance certification to penetration testing and architecture design.'

export const edgeIntro =
  'We combine deep automotive domain knowledge with cutting-edge cybersecurity expertise. Every engagement is led by specialists who have worked inside OEM programs, Tier-1 architectures, and international regulatory bodies.'

/** "Why choose SecureXmotive" cards, in display order. */
export const edgePoints: EdgePoint[] = [
  {
    title: 'Domain-Native',
    description: 'Built by engineers who come from automotive, not generic IT security.',
  },
  {
    title: 'Regulation-Ready',
    description: 'Ahead of UNECE R155/R156 and Cyber Resilience Act timelines.',
  },
  {
    title: 'End-to-End',
    description: 'From concept TARA through production certification and beyond.',
  },
  {
    title: 'Global Reach',
    description: 'Supporting OEMs across EU, India, and Asia-Pacific markets.',
  },
]
