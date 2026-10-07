import type {
  CompanyStatement,
  CoreUSP,
  CoreValue,
  CorporatePillar,
  CorporateService,
  PartnershipAdvantage,
  SectorSpecialization,
  TimelineEntry,
} from '@/types/company'

export const companyIntro =
  'SecureXmotive is a specialized cybersecurity engineering and advisory firm purpose-built to defend the interconnected mobility, agricultural, industrial, and heavy equipment ecosystems.'

/** Corporate Overview Hero & Who We Are data from PDF */
export const corporateHero = {
  tagline: 'CYBER-PHYSICAL SECURITY FOR NEXT-GEN MOBILITY & MACHINERY',
  documentContext: 'CORPORATE OVERVIEW • ABOUT US',
  heading: 'Cyber-Physical Security',
  highlight: 'For Next-Gen Mobility & Machinery',
}

export const whoWeAre = {
  label: 'Who We Are',
  subtitle: 'Defending the converged frontier of embedded system architecture & operational technology',
  paragraphs: [
    'SecureXmotive is a specialized cybersecurity engineering and advisory firm purpose-built to defend the interconnected mobility, agricultural, industrial, and heavy equipment ecosystems. Operating at the converged frontier of embedded system architecture, operational technology (OT), and advanced threat intelligence, we provide full-lifecycle defense mechanisms for mission-critical cyber-physical assets.',
    'From connected software-defined passenger cars to autonomous harvesters and off-highway mining rigs, SecureXmotive partners with Global OEMs, Tier-1 system integrators, and heavy equipment manufacturers. We bridge the gap between complex regulatory mandates and production-grade engineering, ensuring that functional safety and cybersecurity go hand-in-hand.',
  ],
}

/** Three prominent highlight pillars from Page 1 of the PDF */
export const corporatePillars: CorporatePillar[] = [
  {
    title: 'GLOBAL OEM LEADER',
    subtitle: 'TRUSTED TIER-1 & OEM PARTNER',
    highlight: 'Global Tier-1 & OEM Partner',
  },
  {
    title: 'END-TO-END',
    subtitle: 'CHIP-TO-CLOUD PROTECTION',
    highlight: 'Silicon-to-Cloud Lifecycle Defense',
  },
  {
    title: '100% COMPLIANT',
    subtitle: 'UN R155, R156 & ISO 21434',
    highlight: 'Turnkey Regulatory Certification',
  },
]

/** Sector specializations from Page 1 of the PDF */
export const sectorSpecializations: SectorSpecialization[] = [
  {
    id: 'automotive-passenger',
    title: 'Automotive & Passenger Vehicles',
    description:
      'Comprehensive security for Software-Defined Vehicles (SDVs), domain controllers, ADAS sensor suites, IVI head units, and cloud-connected V2X channels.',
    architectures: ['Software-Defined Vehicles (SDVs)', 'Domain Controllers', 'ADAS Sensor Suites', 'IVI Head Units', 'V2X Channels'],
    icon: 'automotive',
  },
  {
    id: 'agriculture-farming',
    title: 'Agriculture & Smart Farming',
    description:
      'Hardening autonomous field machinery, smart implement attachments, ISOBUS protocol communication, and farm operational management telematics.',
    architectures: ['Autonomous Field Machinery', 'Smart Implement Attachments', 'ISOBUS Protocol', 'Farm Management Telematics'],
    icon: 'agriculture',
  },
  {
    id: 'commercial-logistics',
    title: 'Commercial Vehicles & Logistics',
    description:
      'Protecting heavy-duty transport, transit fleets, telematics gateway modules, remote diagnostic interfaces, and J1939/CAN bus networks.',
    architectures: ['Heavy-Duty Transport', 'Transit Fleets', 'Telematics Gateways', 'Remote Diagnostics', 'J1939 / CAN Bus'],
    icon: 'commercial',
  },
  {
    id: 'industrial-off-highway',
    title: 'Industrial & Off-Highway Machinery',
    description:
      'Cyber defense tailored for construction, mining, and industrial automation where physical safety, zero downtime, and ruggedness are paramount.',
    architectures: ['Construction & Mining Rigs', 'Industrial Automation', 'Zero Downtime', 'Physical Safety (ISO 25119)'],
    icon: 'industrial',
  },
]

/** Core Unique Selling Propositions (USPs) from Page 1 of the PDF */
export const coreUSPs: CoreUSP[] = [
  {
    index: '01',
    title: 'EMBEDDED HARDWARE-FIRST DNA',
    description:
      'Unlike traditional IT security firms, our engineers understand silicon, hardware security modules (HSMs), bus protocols (CAN, LIN, Ethernet), and microcontrollers.',
    accent: 'teal',
  },
  {
    index: '02',
    title: 'CROSS-INDUSTRY SYNERGIES',
    description:
      'We leverage insights across automotive, agriculture, and heavy machinery, applying cross-domain threat intelligence to identify multi-vector attacks.',
    accent: 'orange',
  },
  {
    index: '03',
    title: 'TURNKEY REGULATORY ALIGNMENT',
    description:
      'We take customers from initial governance design to complete audit readiness for UN Regulation 155/156, ISO/SAE 21434, and EU Cyber Resilience Act.',
    accent: 'teal',
  },
  {
    index: '04',
    title: 'ZERO-DOWNTIME OT FOCUS',
    description:
      'Our security architecture design prioritizes operational continuity and functional safety (ISO 26262/ISO 25119), avoiding mission-critical lockups.',
    accent: 'orange',
  },
]

/** Comprehensive End-to-End Service Offerings from Page 2 of the PDF */
export const corporateServices: CorporateService[] = [
  {
    index: '01',
    title: 'Threat Analysis & Risk Assessment (TARA)',
    badge: 'ISO/SAE 21434 ALIGNED',
    badgeTone: 'teal',
    description:
      'Systematic asset identification, threat agent modeling, attack tree analysis, and risk scoring tailored to vehicle and machinery architectures. We deliver actionable safety-cyber risk metrics that guide functional specification design.',
  },
  {
    index: '02',
    title: 'Governance, CSMS & SUMS Implementation',
    badge: 'UN R155 & R156 COMPLIANCE',
    badgeTone: 'cyan',
    description:
      'End-to-end audit prep and process setup for Cybersecurity Management Systems (CSMS) and Software Update Management Systems (SUMS). We draft policies, establish traceability matrices, and guide organizations through type-approval certification.',
  },
  {
    index: '03',
    title: 'Embedded Systems & Security Architecture Engineering',
    badge: 'SILICON TO STACK',
    badgeTone: 'teal',
    description:
      'Designing hardware-rooted trust anchors, Secure Boot protocols, Hardware Security Module (HSM) firmware integration, Secure On-Board Communication (SecOC), PKI key management, and secure gateway routing across heterogenous networks.',
  },
  {
    index: '04',
    title: 'Hardware & Software Penetration Testing',
    badge: 'ETHICAL HACKING & AUDITING',
    badgeTone: 'orange',
    description:
      'Deep-dive black-box and white-box penetration testing on target ECUs, telematics units, mobile companion apps, and cloud endpoints. Includes bus injection attacks, side-channel analysis, fault injection, and reverse-engineering of firmware.',
  },
  {
    index: '05',
    title: 'vSOC, Managed Detection & Over-The-Air (OTA) Security',
    badge: 'POST-PRODUCTION DEFENSE',
    badgeTone: 'purple',
    description:
      'Building Vehicle Security Operations Center (vSOC) playbooks, log aggregation rules for telemetry, intrusion detection systems (IDS/IDPS), and managing secure Over-The-Air software update pipelines for vulnerability remediation.',
  },
]

/** Why Partner With SecureXmotive from Page 2 of the PDF */
export const whyPartner = {
  label: 'Partnership Value',
  title: 'Why Partner With',
  highlight: 'SecureXmotive?',
  subheading: 'BRIDGING EMBEDDED ENGINEERING & CYBER DEFENSE',
  paragraphs: [
    'As mobile platforms evolve into software-defined ecosystems, traditional IT security measures fall short against specialized embedded attack surfaces. SecureXmotive brings together domain engineers, cryptographic experts, and automotive cybersecurity veterans.',
    'We help our clients minimize time-to-market, pass stringent regulatory hurdles without friction, and build enduring end-user trust across automotive, agricultural, fleet, and industrial sectors worldwide.',
  ],
  advantages: [
    {
      title: 'Accelerated Time-to-Market',
      description: 'Avoid costly redesigns and late-stage blockers by baking hardware-rooted cyber defense into early concept and specification phases.',
      metric: 'Fast-Track',
    },
    {
      title: 'Frictionless Regulatory Approval',
      description: 'Audit-ready compliance packages for UN R155/R156, ISO 21434, and EU CRA verified through authoritative type-approval workflows.',
      metric: '100% Audit Ready',
    },
    {
      title: 'Mission-Critical OT Continuity',
      description: 'Functional safety alignment (ISO 26262/ISO 25119) ensuring zero unintended vehicle lockups, field downtime, or physical hazards.',
      metric: 'Zero-Downtime',
    },
    {
      title: 'Deep Domain Engineering',
      description: 'Specialized mastery of automotive silicon, HSM integration, CAN/LIN/Ethernet protocols, and complex distributed ECUs.',
      metric: 'Silicon-to-Cloud',
    },
  ] as PartnershipAdvantage[],
}

/* Backward-compatible exports */
export const statements: CompanyStatement[] = [
  {
    label: 'MISSION',
    heading: 'Making Every Cyber-Physical Asset Resilient',
    body: 'We exist to close the gap between ambitious vehicle connectivity and heavy equipment roadmaps and the cybersecurity engineering discipline required to execute them safely. By embedding deep domain expertise into every engagement, we help OEMs and suppliers achieve genuine security — not checkbox compliance.',
    tone: 'teal',
  },
  {
    label: 'VISION',
    heading: 'A World Where Connected Mobility Cannot Be Compromised',
    body: 'We envision a future where every vehicle, agricultural harvester, and industrial asset in operation has been built with security rigor comparable to the engineering excellence the automotive industry applies to safety — because in connected cyber-physical systems, the two are inseparable.',
    tone: 'orange',
  },
]

export const coreValues: CoreValue[] = [
  {
    index: '01',
    title: 'Embedded Hardware-First DNA',
    description:
      'Unlike traditional IT security firms, our engineers understand silicon, hardware security modules (HSMs), bus protocols (CAN, LIN, Ethernet), and microcontrollers.',
  },
  {
    index: '02',
    title: 'Cross-Industry Synergies',
    description:
      'We leverage insights across automotive, agriculture, and heavy machinery, applying cross-domain threat intelligence to identify multi-vector attacks.',
  },
  {
    index: '03',
    title: 'Turnkey Regulatory Alignment',
    description:
      'We take customers from initial governance design to complete audit readiness for UN Regulation 155/156, ISO/SAE 21434, and EU Cyber Resilience Act.',
  },
  {
    index: '04',
    title: 'Zero-Downtime OT Focus',
    description:
      'Our security architecture design prioritizes operational continuity and functional safety (ISO 26262/ISO 25119), avoiding mission-critical lockups.',
  },
]

export const timeline: TimelineEntry[] = [
  {
    year: '2019',
    event: 'SecureXmotive founded in Pune, India, with a focus on ISO 21434 pre-publication work.',
  },
  { year: '2020', event: 'First OEM CSMS implementation completed. Team expands to Munich.' },
  {
    year: '2021',
    event:
      'ISO 21434 published. SecureXmotive supports three Tier-1 suppliers with immediate gap assessments.',
  },
  {
    year: '2022',
    event:
      'UNECE R155/R156 enforcement begins. First type approval support engagements completed.',
  },
  {
    year: '2023',
    event:
      'Singapore office opens. Penetration Testing practice established under dedicated leadership.',
  },
  {
    year: '2024',
    event: 'AIS 189/190 India compliance practice launched. CRA readiness service introduced.',
  },
  {
    year: '2025',
    event:
      '200th vehicle & heavy machinery platform secured. TARA practice recognized as ISO 21434 reference methodology.',
  },
  {
    year: '2026',
    event:
      'Expansion to Brussels. Corporate overview & cyber-physical security lifecycle practice deployed worldwide.',
  },
]
