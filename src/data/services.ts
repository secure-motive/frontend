import type { ServiceDomain } from '@/types/service'

/**
 * The five service domains, in display order. This file is the single source
 * for the Services page, the domain pages, the Home previews, the navigation
 * menus, the footer and the Contact form's service list.
 *
 * All content is derived directly from the client-supplied service specification PDFs.
 */
export const serviceDomains: ServiceDomain[] = [
  {
    slug: 'automotive',
    slugAliases: ['cybersecurity-consulting'],
    index: '01',
    label: 'STRATEGY',
    name: 'Automotive Cybersecurity Consulting',
    accent: 'teal',
    tagline: 'Building the Cybersecurity Management System your vehicle programs demand.',
    summary:
      'Strategic automotive cybersecurity guidance aligned with UN regulations and ISO standards for OEMs and Tier suppliers.',
    intro:
      'Modern vehicles are complex distributed computing systems interconnected with cloud services, V2X infrastructure, and external diagnostic networks. A reactive security posture is no longer viable. SecureXmotive partners with OEMs, Tier-1 integrators, and Tier-2 component suppliers to establish cybersecurity programs that satisfy regulatory mandates and protect brand reputation from concept to end-of-life.\n\nOur automotive cybersecurity services are designed to support organizations from the earliest stages of vehicle development through production, deployment, monitoring, incident response, and end-of-life. We help organizations establish cybersecurity as an integral part of vehicle engineering rather than treating it as an afterthought.',
    standards: ['ISO/SAE 21434', 'UN R155', 'UN R156', 'CSMS', 'TARA', 'SBOM'],
    items: [
      {
        slug: 'cybersecurity-engineering-architecture',
        title: 'Cybersecurity Engineering & Architecture',
        points: [
          {
            title: 'Lifecycle Cybersecurity Engineering',
            body: [
              'Our automotive cybersecurity services support organizations from the earliest stages of vehicle development through production, deployment, monitoring, incident response, and end-of-life. We help organizations establish cybersecurity as an integral part of vehicle engineering rather than treating it as an afterthought.',
            ],
          },
          {
            title: 'Core Engineering Capabilities',
            body: [
              'Our engineering practice delivers complete end-to-end security design:',
              [
                'Threat Analysis and Risk Assessment (TARA)',
                'Vehicle and ECU cybersecurity architecture',
                'Cybersecurity requirements engineering',
                'Secure design and development',
                'Cybersecurity concept development',
                'Threat modelling and risk assessment',
              ],
            ],
          },
        ],
      },
      {
        slug: 'attack-surface-ecosystem-security',
        title: 'Attack Surface & Ecosystem Security',
        points: [
          {
            title: 'Expanding Vehicle Attack Surfaces',
            body: [
              'As vehicles become increasingly connected, attack surfaces continue to expand. Wireless interfaces, cellular connectivity, Bluetooth, Wi-Fi, USB, diagnostics, telematics, mobile applications, cloud platforms, and backend systems can all become potential entry points for attackers. secureXmotive helps identify these attack paths and establish appropriate security controls.',
            ],
          },
          {
            title: 'Comprehensive Ecosystem Assessment',
            body: [
              'Our services extend beyond individual vehicle components. We assess cybersecurity across the broader ecosystem—including ECUs, in-vehicle networks, gateways, cloud infrastructure, mobile applications, diagnostic systems, OTA platforms, and connected services.',
            ],
          },
          {
            title: 'Network & Interface Protections',
            body: [
              'Specialized security controls across communication boundaries:',
              [
                'Vehicle network and communication security',
                'Diagnostic security',
                'OTA cybersecurity',
                'In-vehicle gateways and boundary trust zones',
              ],
            ],
          },
        ],
      },
      {
        slug: 'verification-validation-vulnerability-management',
        title: 'Verification, Validation & Vulnerability Management',
        points: [
          {
            title: 'Lifecycle Validation & Operations',
            body: [
              'Our expertise covers TARA, cybersecurity validation, penetration testing, vulnerability management, incident response, and cybersecurity lifecycle management.',
            ],
          },
          {
            title: 'Testing & Vulnerability Capabilities',
            body: [
              'Rigorous technical testing across physical hardware and cloud integrations:',
              [
                'Penetration testing and vulnerability assessment',
                'Vehicle and ECU security testing',
                'SBOM and vulnerability management',
                'Incident response and vulnerability monitoring',
              ],
            ],
          },
        ],
      },
      {
        slug: 'regulatory-compliance-csms',
        title: 'Regulatory Compliance & CSMS Governance',
        points: [
          {
            title: 'Regulatory Alignment & Readiness',
            body: [
              'We help organizations align their cybersecurity programs with industry expectations and regulatory requirements, including ISO/SAE 21434 and UN R155, while supporting cybersecurity processes throughout the development lifecycle.',
            ],
          },
          {
            title: 'Governance & Process Capabilities',
            body: [
              'Establishing auditable, compliant cybersecurity management systems:',
              [
                'Automotive Cybersecurity Management Systems (CSMS)',
                'UN R155 and ISO/SAE 21434 readiness',
                'Cybersecurity program and process implementation',
                'Cybersecurity lifecycle management',
              ],
            ],
          },
        ],
      },
      {
        slug: 'why-securexmotive',
        title: 'Why secureXmotive?',
        points: [
          {
            title: 'Protecting Vehicles, Passengers & Brands',
            body: [
              'Because vehicle cybersecurity is not simply about protecting software—it is about protecting vehicles, passengers, businesses, data, and brand reputation.',
            ],
          },
          {
            title: 'Secure by Design for Connected Mobility',
            body: [
              'At secureXmotive, we combine automotive domain knowledge with cybersecurity expertise to help organizations build vehicles that are secure by design, resilient against emerging threats, and prepared for the connected future.',
              'secureXmotive — Driving Cybersecurity into the Future of Mobility.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'compliance-certification',
    slugAliases: ['agriculture', 'compliance'],
    index: '02',
    label: 'COMPLIANCE',
    name: 'Compliance & Certification Support',
    accent: 'orange',
    tagline: 'End-to-end support for CSMS/SUMS type approval, UNECE R155/R156 and ISO 21434 certification.',
    summary:
      'End-to-end support for CSMS/SUMS type approval, UNECE R155/R156, ISO 21434 certification and audit preparation.',
    intro:
      'Agricultural machinery is rapidly becoming connected, automated, and software-defined. Modern tractors, combines, sprayers, harvesters, precision-farming systems, and connected implements rely on sophisticated electronics, sensors, wireless connectivity, GNSS, telematics, cloud platforms, and software.\n\nThis digital transformation is creating enormous opportunities for productivity—but it is also creating new cybersecurity risks. secureXmotive provides specialized cybersecurity consulting services to help agricultural vehicle manufacturers, implement manufacturers, technology providers, and connected farming ecosystems.',
    standards: ['ISO 24882', 'ISOBUS (ISO 11783)', 'TARA', 'GNSS', 'Telematics'],
    items: [
      {
        slug: 'agricultural-machinery-ecosystem-security',
        title: 'Agricultural Machinery & Ecosystem Security',
        points: [
          {
            title: 'Complete Ecosystem Vulnerability Identification',
            body: [
              'We help organizations identify vulnerabilities across the complete agricultural machinery ecosystem—from onboard ECUs and electronic networks to connected implements, telematics systems, mobile applications, cloud platforms, and remote services.',
            ],
          },
          {
            title: 'Protecting Productivity & Operational Continuity',
            body: [
              'A compromised agricultural vehicle can have consequences far beyond data loss. Manipulation of machine functions, unauthorized access to implements, disruption of precision farming systems, or compromise of fleet management platforms can directly affect productivity, crop operations, safety, and business continuity.',
            ],
          },
          {
            title: 'Core Assessment & Architecture Offerings',
            body: [
              'Delivering foundational security across agricultural platforms:',
              [
                'Agricultural vehicle cybersecurity assessment',
                'TARA and threat modelling',
                'ECU and network security',
                'Vehicle and fleet cybersecurity architecture',
              ],
            ],
          },
        ],
      },
      {
        slug: 'connected-implement-telematics-security',
        title: 'Connected Implement & Telematics Security',
        points: [
          {
            title: 'Connected Implement Interface Protection',
            body: [
              'Connected implements deserve particular attention. Tractors increasingly communicate with implements through electronic interfaces, creating pathways through which a compromised implement could potentially affect the vehicle ecosystem.',
            ],
          },
          {
            title: 'Authentication, Segmentation & Monitoring',
            body: [
              'secureXmotive can help manufacturers assess these interfaces and establish appropriate authentication, authorization, segmentation, monitoring, and protection mechanisms.',
            ],
          },
          {
            title: 'Implement & Remote-Access Capabilities',
            body: [
              'Specialized capabilities for connected farming environments:',
              [
                'Connected implement cybersecurity',
                'Telematics and remote-access security',
                'GNSS and connected-system security assessments',
                'Secure diagnostics and communication protocols',
              ],
            ],
          },
        ],
      },
      {
        slug: 'lifecycle-security-testing-operations',
        title: 'Lifecycle Security, Testing & Operations',
        points: [
          {
            title: 'Lifecycle-Based Approach',
            body: [
              'secureXmotive takes a lifecycle-based approach to agricultural cybersecurity. We help manufacturers integrate security from concept and architecture through development, testing, production, deployment, monitoring, and incident response.',
            ],
          },
          {
            title: 'Validation, Updates & Monitoring',
            body: [
              'Testing and operational resilience services across machinery deployments:',
              [
                'Penetration testing',
                'Vulnerability assessment and management',
                'Secure diagnostics',
                'OTA update security',
                'Incident response planning',
                'Cybersecurity lifecycle implementation',
                'Security monitoring strategy',
              ],
            ],
          },
        ],
      },
      {
        slug: 'governance-standards-alignment',
        title: 'Governance & Standards Alignment',
        points: [
          {
            title: 'Cybersecurity Governance',
            body: [
              'We support organizations in establishing cybersecurity governance and aligning their processes with applicable automotive and industrial cybersecurity expectations.',
            ],
          },
          {
            title: 'Regulatory & Standard Alignment',
            body: [
              'Harmonizing agricultural equipment development with global cybersecurity benchmarks:',
              [
                'Cybersecurity governance and program implementation',
                'Alignment with ISO 24882 agricultural cybersecurity expectations',
                'Automotive and industrial standard harmonization',
              ],
            ],
          },
        ],
      },
      {
        slug: 'why-securexmotive',
        title: 'Why secureXmotive?',
        points: [
          {
            title: 'Securing the Entire Chain',
            body: [
              'Agricultural machinery is becoming an interconnected digital ecosystem. Securing one machine is no longer enough—you need to secure the entire chain of machines, implements, networks, applications, and cloud services.',
            ],
          },
          {
            title: 'Security by Design for Modern Agriculture',
            body: [
              'secureXmotive helps agricultural technology companies move from reactive security to security by design, enabling connected farming solutions that are productive, resilient, and trustworthy.',
              'secureXmotive — Securing the Technology Behind Modern Agriculture.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'threat-analysis-tara',
    slugAliases: ['off-highway', 'tara'],
    index: '03',
    label: 'RISK',
    name: 'Threat Analysis & Risk Assessment (TARA)',
    accent: 'yellow',
    tagline: 'Systematic asset identification, threat modeling with STRIDE/EVITA, and risk treatment per ISO 21434.',
    summary:
      'Systematic asset identification, threat modeling with STRIDE/EVITA, and risk treatment per ISO 21434 Section 15.',
    intro:
      'Construction, mining, forestry, material handling, and other off-highway industries are undergoing a digital transformation. Excavators, loaders, cranes, forklifts, autonomous machines, and specialized equipment increasingly depend on electronic control systems, sensors, telematics, connectivity, remote diagnostics, automation, and cloud-based fleet platforms.\n\nAs machines become smarter and more connected, their cybersecurity exposure grows. secureXmotive provides specialized cybersecurity consulting services to help off-highway vehicle manufacturers and technology providers protect machines throughout their complete lifecycle.',
    standards: ['TARA', 'CAN / J1939', 'Industrial Ethernet', 'Telematics', 'Autonomous Systems'],
    items: [
      {
        slug: 'machine-controller-security-assessments',
        title: 'Machine & Controller Security Assessments',
        points: [
          {
            title: 'Critical Availability, Safety & Reliability',
            body: [
              'Off-highway vehicles operate in environments where availability, safety, productivity, and reliability are critical. A cyberattack that disrupts machine operation, manipulates control functions, compromises telemetry, or disables a fleet management platform can result in significant operational and financial consequences.',
            ],
          },
          {
            title: 'Attack Path Identification',
            body: [
              'Our approach begins by understanding the machine, its operating environment, its architecture, and its connectivity. We identify potential attack paths across ECUs, CAN and Ethernet networks, diagnostic interfaces, wireless connectivity, telematics units, remote-access systems, cloud platforms, and external equipment.',
            ],
          },
          {
            title: 'Core Machine Services',
            body: [
              'Comprehensive assessments across heavy-duty equipment:',
              [
                'Machine and vehicle cybersecurity assessments',
                'Threat Analysis and Risk Assessment (TARA)',
                'Cybersecurity architecture',
                'ECU and controller security',
              ],
            ],
          },
        ],
      },
      {
        slug: 'networks-telematics-autonomous-systems',
        title: 'Networks, Telematics & Autonomous Systems',
        points: [
          {
            title: 'Advanced Operational Capabilities',
            body: [
              'We assess cybersecurity risks associated with increasingly common capabilities such as remote machine monitoring, autonomous operation, predictive maintenance, fleet management, and remote diagnostics.',
            ],
          },
          {
            title: 'Communication & Network Security',
            body: [
              'Hardening bus communications, wireless links, and fleet platforms:',
              [
                'CAN, Ethernet and network security',
                'Telematics and remote-access security',
                'Diagnostic security',
                'OTA update security',
                'Secure communications',
                'Fleet cybersecurity',
                'Autonomous-machine security assessment',
              ],
            ],
          },
        ],
      },
      {
        slug: 'verification-lifecycle-governance',
        title: 'Verification, Lifecycle & Governance',
        points: [
          {
            title: 'End-to-End Lifecycle Support',
            body: [
              'secureXmotive supports manufacturers with Threat Analysis and Risk Assessment, cybersecurity architecture, security requirements, penetration testing, vulnerability assessment, network security, diagnostic security, secure OTA updates, and cybersecurity lifecycle management.',
            ],
          },
          {
            title: 'Validation & Operational Defense',
            body: [
              'Rigorous technical testing and operational governance:',
              [
                'Penetration testing',
                'Vulnerability assessment',
                'Incident response planning',
                'Cybersecurity process and governance',
              ],
            ],
          },
        ],
      },
      {
        slug: 'from-connected-machines-to-secure-fleets',
        title: 'From Connected Machines to Secure Fleets',
        points: [
          {
            title: 'Interconnected Ecosystem Protection',
            body: [
              'The cybersecurity challenge does not end with the machine. Modern off-highway ecosystems connect machines with dealers, service organizations, cloud platforms, mobile applications, operators, and fleet management systems.',
              'secureXmotive evaluates these interconnected ecosystems to help manufacturers understand where trust boundaries exist, where vulnerabilities could propagate, and how security controls can contain potential attacks.',
            ],
          },
          {
            title: 'Lifetime Resilience Across Tough Environments',
            body: [
              'Our goal is simple: help manufacturers build machines that remain secure, available, reliable, and resilient throughout their operational lifetime.',
              'Whether you are developing a new connected machine or modernizing an existing product portfolio, secureXmotive can help embed cybersecurity into your engineering and business processes.',
              'secureXmotive — Securing the Machines That Build, Move, Mine, and Harvest.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'penetration-testing',
    slugAliases: ['commercial', 'commercial-vehicles'],
    index: '04',
    label: 'OFFENSIVE',
    name: 'Penetration Testing & VA',
    accent: 'red',
    tagline: 'ECU exploitation, telematics testing, and comprehensive attack surface security testing.',
    summary:
      'ECU exploitation, telematics interface testing, OBD port probing, and V2X communication security assessment.',
    intro:
      'Trucks, buses, coaches, delivery vehicles, and other commercial vehicles are rapidly evolving into connected digital platforms. Telematics, fleet management, remote diagnostics, ADAS, infotainment, connected services, electronic control units, and OTA updates are transforming how commercial fleets operate.\n\nBut every new connection introduces another potential cybersecurity risk. secureXmotive helps truck, bus, and commercial vehicle manufacturers protect their vehicles, fleets, infrastructure, and connected services against evolving cyber threats.',
    standards: ['UN R155', 'UN R156', 'ISO/SAE 21434', 'SAE J1939', 'CSMS'],
    items: [
      {
        slug: 'fleet-continuity-vehicle-architecture',
        title: 'Fleet Continuity & Vehicle Architecture',
        points: [
          {
            title: 'Cybersecurity Linked to Business Continuity',
            body: [
              'For commercial fleets, cybersecurity is directly linked to business continuity. A cyber incident affecting vehicle availability, fleet management, remote services, logistics systems, or critical vehicle functions can create operational disruption, financial losses, safety concerns, and reputational damage.',
              'Our cybersecurity consultants help organizations understand and manage these risks throughout the vehicle lifecycle.',
            ],
          },
          {
            title: 'Architecture & Assessment Capabilities',
            body: [
              'Engineering robust architectures across commercial vehicle categories:',
              [
                'Truck and bus cybersecurity assessment',
                'TARA and threat modelling',
                'Cybersecurity architecture',
                'CSMS implementation support',
                'ECU and network security',
              ],
            ],
          },
        ],
      },
      {
        slug: 'attack-surfaces-fleet-ecosystems',
        title: 'Attack Surfaces & Fleet Ecosystems',
        points: [
          {
            title: 'Expansive Attack Surface Assessment',
            body: [
              'We assess attack surfaces across vehicle networks, diagnostic interfaces, telematics systems, cellular connectivity, Wi-Fi, Bluetooth, mobile applications, cloud platforms, fleet management systems, and backend infrastructure.',
            ],
          },
          {
            title: 'Unique Commercial Ecosystem Considerations',
            body: [
              'Commercial vehicles also introduce unique cybersecurity considerations. A truck may remain connected for years, operate across multiple countries, interact with trailers and implements, and communicate continuously with fleet infrastructure. Buses may connect to passenger-facing systems, depot infrastructure, and public networks. These complex ecosystems require cybersecurity strategies that go beyond protecting individual ECUs.',
            ],
          },
          {
            title: 'Fleet & Connectivity Defense',
            body: [
              'Securing long-haul, depot, and multi-system communication channels:',
              [
                'Telematics cybersecurity',
                'Fleet management security',
                'Diagnostic security',
                'OTA security',
                'Backend and cloud security assessment',
                'Connected trailer and implement security',
              ],
            ],
          },
        ],
      },
      {
        slug: 'testing-vulnerability-compliance',
        title: 'Testing, Vulnerability & Compliance',
        points: [
          {
            title: 'Comprehensive Lifecycle Scope',
            body: [
              'secureXmotive provides services covering TARA, cybersecurity architecture, secure vehicle design, ECU and network security, penetration testing, vulnerability management, secure diagnostics, telematics security, OTA security, incident response, and cybersecurity governance.',
            ],
          },
          {
            title: 'Validation & Regulatory Support',
            body: [
              'Ensuring full type approval and operational security readiness:',
              [
                'Penetration testing',
                'Vulnerability management',
                'Incident response planning',
                'UN R155 and ISO/SAE 21434 support',
              ],
            ],
          },
        ],
      },
      {
        slug: 'secure-vehicles-fleets-operations',
        title: 'Secure Vehicles. Secure Fleets. Secure Operations.',
        points: [
          {
            title: 'Protecting the Entire Connected Ecosystem',
            body: [
              'At secureXmotive, we understand that commercial vehicle cybersecurity must protect more than the vehicle itself. It must protect the entire ecosystem connecting vehicles, drivers, fleet operators, workshops, dealers, cloud platforms, and backend systems.',
            ],
          },
          {
            title: 'Enabler of Reliable & Trusted Transportation',
            body: [
              'Our objective is to help commercial vehicle manufacturers build cybersecurity into every stage of the product lifecycle while creating practical processes that can be implemented across large vehicle portfolios and global fleets.',
              'With secureXmotive, cybersecurity becomes an enabler of reliable, connected, and trusted transportation.',
              'secureXmotive — Securing the Future of Commercial Mobility.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'security-architecture',
    slugAliases: ['industrial-ot'],
    index: '05',
    label: 'DESIGN',
    name: 'Security Architecture & Design',
    accent: 'purple',
    tagline: 'Secure-by-design architecture, HSM integration, and cryptographic key management frameworks.',
    summary:
      'Secure-by-design architecture, HSM integration, OTA update security, and cryptographic key management frameworks.',
    intro:
      'Industrial organizations increasingly depend on connected Operational Technology (OT), Industrial Control Systems (ICS), SCADA platforms, PLCs, HMIs, industrial networks, remote-access systems, sensors, and connected machinery.\n\nWhile connectivity improves efficiency and enables digital transformation, it also introduces cybersecurity risks into environments where availability, safety, and operational continuity are critical. secureXmotive provides specialized cybersecurity consulting services for organizations looking to protect their industrial control environments against modern cyber threats.',
    standards: ['IEC 62443', 'SCADA / PLC', 'Purdue Model', 'IT/OT Segmentation', 'Industrial Ethernet'],
    items: [
      {
        slug: 'ot-ics-cybersecurity-assessments',
        title: 'OT & ICS Cybersecurity Assessments',
        points: [
          {
            title: 'OT-Focused Cybersecurity Approach',
            body: [
              'Unlike traditional IT environments, industrial systems often operate continuously and control physical processes. A cybersecurity incident can therefore have consequences extending beyond data loss—including production shutdowns, equipment damage, safety incidents, environmental impact, and significant financial losses.',
              'secureXmotive takes an OT-focused approach to cybersecurity, recognizing the unique requirements of industrial environments. We help organizations understand their OT attack surface, identify vulnerabilities, establish appropriate security controls, and improve cyber resilience without unnecessarily disrupting production.',
            ],
          },
          {
            title: 'Assessment & Risk Capabilities',
            body: [
              'Rigorous evaluation across operational hardware and automation layers:',
              [
                'OT and ICS cybersecurity assessments',
                'Industrial network security',
                'SCADA and PLC security assessment',
                'OT threat modelling and risk assessment',
              ],
            ],
          },
        ],
      },
      {
        slug: 'it-ot-network-segmentation-architecture',
        title: 'IT/OT Network Segmentation & Architecture',
        points: [
          {
            title: 'Critical Zones & Conduits Segmentation',
            body: [
              'A critical component of OT cybersecurity is segmentation. If an attacker compromises an IT system, weak boundaries between IT and OT can allow the attack to move toward industrial control systems. secureXmotive helps organizations establish appropriate zones, conduits, access controls, monitoring, and security architecture.',
            ],
          },
          {
            title: 'Broad Industrial Environment Scope',
            body: [
              'We assess industrial environments across PLCs, RTUs, HMIs, SCADA systems, engineering workstations, industrial Ethernet, legacy protocols, gateways, remote-access solutions, and connections between IT and OT networks.',
            ],
          },
          {
            title: 'Architecture & Boundary Controls',
            body: [
              'Hardening control systems and plant networks:',
              [
                'Network segmentation',
                'IT/OT security architecture',
                'Remote-access security',
                'Secure industrial communications',
              ],
            ],
          },
        ],
      },
      {
        slug: 'testing-resilience-governance',
        title: 'Testing, Resilience & Governance',
        points: [
          {
            title: 'Comprehensive OT Defense Scope',
            body: [
              'Our services include OT cybersecurity assessments, ICS security architecture, network segmentation, threat modelling, vulnerability assessment, penetration testing, security monitoring, remote-access security, incident response, and cybersecurity governance.',
            ],
          },
          {
            title: 'Validation & Cyber Resilience Capabilities',
            body: [
              'Operational testing, active monitoring, and governance compliance:',
              [
                'Vulnerability assessment',
                'Penetration testing',
                'Security monitoring strategy',
                'Incident response and cyber resilience',
                'OT cybersecurity governance',
                'IEC 62443 implementation support',
                'Cybersecurity maturity assessments',
              ],
            ],
          },
        ],
      },
      {
        slug: 'security-without-compromising-operations',
        title: 'Security Without Compromising Operations',
        points: [
          {
            title: 'Balancing Security with Operational Continuity',
            body: [
              'Industrial cybersecurity is not simply about deploying more security tools. It requires an understanding of people, processes, technology, industrial operations, and safety.',
              'secureXmotive combines cybersecurity expertise with an understanding of connected industrial environments to help organizations build practical and sustainable security programs.',
            ],
          },
          {
            title: 'Brownfield Modernization & Greenfield Deployment',
            body: [
              'Whether you are modernizing an existing plant, connecting legacy equipment, deploying new automation systems, or building a new industrial facility, secureXmotive helps you identify cyber risks before they become operational problems.',
              'secureXmotive — Securing the Systems That Keep Industry Running.',
            ],
          },
        ],
      },
    ],
  },
]

export const getServiceDomain = (slug: string): ServiceDomain | undefined =>
  serviceDomains.find((domain) => domain.slug === slug || domain.slugAliases?.includes(slug))

/** The domain after `slug`, or undefined for the last one — the design shows no wrap-around. */
export const getNextServiceDomain = (slug: string): ServiceDomain | undefined => {
  const position = serviceDomains.findIndex(
    (domain) => domain.slug === slug || domain.slugAliases?.includes(slug),
  )
  return position === -1 ? undefined : serviceDomains[position + 1]
}
