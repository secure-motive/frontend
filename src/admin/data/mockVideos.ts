import type { AdminVideo } from '../types/video'

export const INITIAL_MOCK_VIDEOS: AdminVideo[] = [
  {
    id: 'vid-001',
    title: 'CAN Bus Reverse Engineering & Attack Vectors in Modern Vehicles',
    description:
      'A deep dive into Controller Area Network (CAN) arbitration, frame injection, UDS diagnostic exploits, and how SecureXmotive evaluates physical and remote bus vulnerabilities.',
    youtubeUrl: 'https://www.youtube.com/watch?v=7g1C3F9kU9w',
    thumbnailUrl: 'https://img.youtube.com/vi/7g1C3F9kU9w/hqdefault.jpg',
    isPublished: true,
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-10-08T07:20:00.000Z',
  },
  {
    id: 'vid-002',
    title: 'ISO/SAE 21434 Road Vehicles — Cybersecurity Engineering Demystified',
    description:
      'A practical guide for automotive Tier-1s and OEMs navigating CSMS audits, lifecycle cybersecurity requirements, item definition, and work product delivery.',
    youtubeUrl: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
    thumbnailUrl: 'https://img.youtube.com/vi/oHg5SJYRHA0/hqdefault.jpg',
    isPublished: true,
    createdAt: '2026-09-20T14:30:00.000Z',
    updatedAt: '2026-10-06T18:15:00.000Z',
  },
  {
    id: 'vid-003',
    title: 'Automotive Ethernet MACsec & SOME/IP Vulnerability Assessment',
    description:
      'Exploration of high-bandwidth in-vehicle networking architectures, automotive Ethernet PHY fuzzing, VLAN hopping, and SecOC authentication layers.',
    youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    thumbnailUrl: 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
    isPublished: true,
    createdAt: '2026-09-28T09:15:00.000Z',
    updatedAt: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'vid-004',
    title: 'TARA in Practice: Threat Analysis & Risk Assessment for Telematics Gateway',
    description:
      'Step-by-step methodology for identifying threat scenarios, determining impact ratings, assessing attack feasibility with CVSS v3.1 / EVITA, and assigning CAL levels.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
    thumbnailUrl: 'https://img.youtube.com/vi/kXYiU_JCYtU/hqdefault.jpg',
    isPublished: true,
    createdAt: '2026-10-01T11:45:00.000Z',
    updatedAt: '2026-10-04T15:30:00.000Z',
  },
  {
    id: 'vid-005',
    title: 'EV Charging Infrastructure & ISO 15118 Plug & Charge Security',
    description:
      'Security considerations for combined charging systems (CCS), V2G communications, TLS 1.3 implementation flaws, and PKI certificate trust chains.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    thumbnailUrl: 'https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg',
    isPublished: false,
    createdAt: '2026-10-03T16:00:00.000Z',
    updatedAt: '2026-10-07T11:10:00.000Z',
  },
  {
    id: 'vid-006',
    title: 'OTA Software Update Security Under UNECE R156 Mandates',
    description:
      'How to architect tamper-proof Software Update Management Systems (SUMS), dual-bank A/B memory partitions, and cryptographic image signing.',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    thumbnailUrl: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
    isPublished: false,
    createdAt: '2026-10-05T08:30:00.000Z',
    updatedAt: '2026-10-07T14:40:00.000Z',
  },
]
