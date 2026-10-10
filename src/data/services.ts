import type { ServiceDomain } from '@/types/service'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/**
 * The five service domains, in display order. This file is the single source
 * for the Services page, the domain pages, the Home previews, the navigation
 * menus, the footer and the Contact form's service list.
 *
 * All content matches the client-supplied service specification PDFs verbatim.
 */
export const serviceDomains: ServiceDomain[] = [
  {
    slug: 'automotive',
    slugAliases: ['cybersecurity-consulting', 'automotive-cybersecurity-solutions', 'automotive-solutions', 'automotive-cybersecurity'],
    index: '01',
    label: 'AUTOMOTIVE',
    name: 'Automotive Cybersecurity Solutions',
    accent: 'teal',
    tagline: 'Secure Every Vehicle. Protect Every Connection. Build Trust into Every Drive.',
    summary:
      'The modern automobile is no longer just a mechanical machine—it is a connected, software-driven platform. secureXmotive helps automotive manufacturers, Tier-1 suppliers, technology providers, and mobility companies identify, manage, and mitigate cybersecurity risks across the vehicle lifecycle.',
    intro:
      'The modern automobile is no longer just a mechanical machine—it is a connected, software-driven platform. From advanced driver assistance systems and infotainment to telematics, connected services, electronic control units, gateways, and over-the-air updates, vehicles depend on increasingly complex software and communication networks. With this transformation comes a growing cybersecurity risk.\n\nsecureXmotive helps automotive manufacturers, Tier-1 suppliers, technology providers, and mobility companies identify, manage, and mitigate cybersecurity risks across the vehicle lifecycle.\n\nOur automotive cybersecurity services are designed to support organizations from the earliest stages of vehicle development through production, deployment, monitoring, incident response, and end-of-life. We help organizations establish cybersecurity as an integral part of vehicle engineering rather than treating it as an afterthought.\n\nOur expertise covers TARA, cybersecurity concept development, secure architecture, threat modelling, risk assessment, security requirements, cybersecurity validation, penetration testing, vulnerability management, incident response, and cybersecurity lifecycle management.\n\nAs vehicles become increasingly connected, attack surfaces continue to expand. Wireless interfaces, cellular connectivity, Bluetooth, Wi-Fi, USB, diagnostics, telematics, mobile applications, cloud platforms, and backend systems can all become potential entry points for attackers. secureXmotive helps identify these attack paths and establish appropriate security controls.\n\nWe also help organizations align their cybersecurity programs with industry expectations and regulatory requirements, including ISO/SAE 21434 and UN R155, while supporting cybersecurity processes throughout the development lifecycle.\n\nOur services extend beyond individual vehicle components. We assess cybersecurity across the broader ecosystem—including ECUs, in-vehicle networks, gateways, cloud infrastructure, mobile applications, diagnostic systems, OTA platforms, and connected services.',
    video: '/gifs/home.mp4',
    standards: ['ISO/SAE 21434', 'UN R155', 'UN R156', 'CSMS', 'TARA', 'SBOM'],
    servicesHeading: 'What secureXmotive Can Help You With',
    servicesList: [
      'Automotive Cybersecurity Management Systems (CSMS)',
      'Threat Analysis and Risk Assessment (TARA)',
      'Vehicle and ECU cybersecurity architecture',
      'Cybersecurity requirements engineering',
      'Secure design and development',
      'Penetration testing and vulnerability assessment',
      'Vehicle and ECU security testing',
      'Diagnostic security',
      'OTA cybersecurity',
      'Vehicle network and communication security',
      'SBOM and vulnerability management',
      'Incident response and vulnerability monitoring',
      'UN R155 and ISO/SAE 21434 readiness',
      'Cybersecurity program and process implementation',
    ],
    closingSection: {
      title: 'Why secureXmotive?',
      paragraphs: [
        'Because vehicle cybersecurity is not simply about protecting software—it is about protecting vehicles, passengers, businesses, data, and brand reputation.',
        'At secureXmotive, we combine automotive domain knowledge with cybersecurity expertise to help organizations build vehicles that are secure by design, resilient against emerging threats, and prepared for the connected future.',
      ],
      slogan: 'secureXmotive — Driving Cybersecurity into the Future of Mobility.',
    },
    items: [
      'Automotive Cybersecurity Management Systems (CSMS)',
      'Threat Analysis and Risk Assessment (TARA)',
      'Vehicle and ECU cybersecurity architecture',
      'Cybersecurity requirements engineering',
      'Secure design and development',
      'Penetration testing and vulnerability assessment',
      'Vehicle and ECU security testing',
      'Diagnostic security',
      'OTA cybersecurity',
      'Vehicle network and communication security',
      'SBOM and vulnerability management',
      'Incident response and vulnerability monitoring',
      'UN R155 and ISO/SAE 21434 readiness',
      'Cybersecurity program and process implementation',
    ].map((title) => ({ slug: slugify(title), title })),
  },
  {
    slug: 'agricultural-vehicles',
    slugAliases: ['compliance-certification', 'agriculture', 'agricultural-vehicle-cybersecurity', 'compliance'],
    index: '02',
    label: 'AGRICULTURE',
    name: 'Agricultural Vehicle Cybersecurity',
    accent: 'orange',
    tagline: 'Protect the Machines That Keep the World Moving.',
    summary:
      'Agricultural machinery is rapidly becoming connected, automated, and software-defined. secureXmotive provides specialized cybersecurity consulting services for agricultural vehicle manufacturers, implement manufacturers, technology providers, and connected farming ecosystems.',
    intro:
      'Agricultural machinery is rapidly becoming connected, automated, and software-defined. Modern tractors, combines, sprayers, harvesters, precision-farming systems, and connected implements rely on sophisticated electronics, sensors, wireless connectivity, GNSS, telematics, cloud platforms, and software.\n\nThis digital transformation is creating enormous opportunities for productivity—but it is also creating new cybersecurity risks.\n\nsecureXmotive provides specialized cybersecurity consulting services for agricultural vehicle manufacturers, implement manufacturers, technology providers, and connected farming ecosystems.\n\nWe help organizations identify vulnerabilities across the complete agricultural machinery ecosystem—from onboard ECUs and electronic networks to connected implements, telematics systems, mobile applications, cloud platforms, and remote services.\n\nA compromised agricultural vehicle can have consequences far beyond data loss. Manipulation of machine functions, unauthorized access to implements, disruption of precision farming systems, or compromise of fleet management platforms can directly affect productivity, crop operations, safety, and business continuity.\n\nsecureXmotive takes a lifecycle-based approach to agricultural cybersecurity. We help manufacturers integrate security from concept and architecture through development, testing, production, deployment, monitoring, and incident response.\n\nOur services include Threat Analysis and Risk Assessment (TARA), cybersecurity architecture, secure communication, ECU and network security, penetration testing, vulnerability assessment, secure diagnostics, OTA security, telematics security, and cybersecurity process development.\n\nConnected implements deserve particular attention. Tractors increasingly communicate with implements through electronic interfaces, creating pathways through which a compromised implement could potentially affect the vehicle ecosystem. secureXmotive can help manufacturers assess these interfaces and establish appropriate authentication, authorization, segmentation, monitoring, and protection mechanisms.\n\nWe also support organizations in establishing cybersecurity governance and aligning their processes with applicable automotive and industrial cybersecurity expectations.',
    video: '/gifs/agriculture.mp4',
    standards: ['ISO 24882', 'ISOBUS (ISO 11783)', 'TARA', 'GNSS', 'Telematics'],
    servicesHeading: 'Our Agricultural Cybersecurity Services',
    servicesList: [
      'Agricultural vehicle cybersecurity assessment',
      'TARA and threat modelling',
      'ECU and network security',
      'Connected implement cybersecurity',
      'Telematics and remote-access security',
      'GNSS and connected-system security assessments',
      'Penetration testing',
      'Vulnerability assessment and management',
      'Secure diagnostics',
      'OTA update security',
      'Vehicle and fleet cybersecurity architecture',
      'Incident response planning',
      'Cybersecurity lifecycle implementation',
      'Security monitoring strategy',
    ],
    closingSection: {
      title: 'Why secureXmotive?',
      paragraphs: [
        'Agricultural machinery is becoming an interconnected digital ecosystem. Securing one machine is no longer enough—you need to secure the entire chain of machines, implements, networks, applications, and cloud services.',
        'secureXmotive helps agricultural technology companies move from reactive security to security by design, enabling connected farming solutions that are productive, resilient, and trustworthy.',
      ],
      slogan: 'secureXmotive — Securing the Technology Behind Modern Agriculture.',
    },
    items: [
      'Agricultural vehicle cybersecurity assessment',
      'TARA and threat modelling',
      'ECU and network security',
      'Connected implement cybersecurity',
      'Telematics and remote-access security',
      'GNSS and connected-system security assessments',
      'Penetration testing',
      'Vulnerability assessment and management',
      'Secure diagnostics',
      'OTA update security',
      'Vehicle and fleet cybersecurity architecture',
      'Incident response planning',
      'Cybersecurity lifecycle implementation',
      'Security monitoring strategy',
    ].map((title) => ({ slug: slugify(title), title })),
  },
  {
    slug: 'off-highway-vehicles',
    slugAliases: ['threat-analysis-tara', 'off-highway', 'off-highway-vehicle-cybersecurity', 'tara'],
    index: '03',
    label: 'OFF-HIGHWAY',
    name: 'Off-Highway Vehicle Cybersecurity',
    accent: 'yellow',
    tagline: 'Secure the Machines Built for the Toughest Environments.',
    summary:
      'Construction, mining, forestry, and heavy industrial vehicles increasingly depend on electronic control systems, telematics, and automation. secureXmotive provides specialized cybersecurity consulting services to protect machines throughout their complete lifecycle.',
    intro:
      'Construction, mining, forestry, material handling, and other off-highway industries are undergoing a digital transformation. Excavators, loaders, cranes, forklifts, autonomous machines, and specialized equipment increasingly depend on electronic control systems, sensors, telematics, connectivity, remote diagnostics, automation, and cloud-based fleet platforms.\n\nAs machines become smarter and more connected, their cybersecurity exposure grows.\n\nsecureXmotive provides specialized cybersecurity consulting services to help off-highway vehicle manufacturers and technology providers protect machines throughout their complete lifecycle.\n\nOff-highway vehicles operate in environments where availability, safety, productivity, and reliability are critical. A cyberattack that disrupts machine operation, manipulates control functions, compromises telemetry, or disables a fleet management platform can result in significant operational and financial consequences.\n\nOur approach begins by understanding the machine, its operating environment, its architecture, and its connectivity. We identify potential attack paths across ECUs, CAN and Ethernet networks, diagnostic interfaces, wireless connectivity, telematics units, remote-access systems, cloud platforms, and external equipment.\n\nsecureXmotive supports manufacturers with Threat Analysis and Risk Assessment, cybersecurity architecture, security requirements, penetration testing, vulnerability assessment, network security, diagnostic security, secure OTA updates, and cybersecurity lifecycle management.\n\nWe also assess cybersecurity risks associated with increasingly common capabilities such as remote machine monitoring, autonomous operation, predictive maintenance, fleet management, and remote diagnostics.',
    video: '/gifs/machinery.mp4',
    standards: ['TARA', 'CAN / J1939', 'Industrial Ethernet', 'Telematics', 'Autonomous Systems'],
    servicesHeading: 'Our Off-Highway Cybersecurity Services',
    servicesList: [
      'Machine and vehicle cybersecurity assessments',
      'Threat Analysis and Risk Assessment',
      'Cybersecurity architecture',
      'ECU and controller security',
      'CAN, Ethernet and network security',
      'Telematics and remote-access security',
      'Diagnostic security',
      'Penetration testing',
      'Vulnerability assessment',
      'OTA update security',
      'Secure communications',
      'Fleet cybersecurity',
      'Autonomous-machine security assessment',
      'Incident response planning',
      'Cybersecurity process and governance',
    ],
    closingSection: {
      title: 'From Connected Machines to Secure Fleets',
      paragraphs: [
        'The cybersecurity challenge does not end with the machine. Modern off-highway ecosystems connect machines with dealers, service organizations, cloud platforms, mobile applications, operators, and fleet management systems.',
        'secureXmotive evaluates these interconnected ecosystems to help manufacturers understand where trust boundaries exist, where vulnerabilities could propagate, and how security controls can contain potential attacks.',
        'Our goal is simple: help manufacturers build machines that remain secure, available, reliable, and resilient throughout their operational lifetime.',
        'Whether you are developing a new connected machine or modernizing an existing product portfolio, secureXmotive can help embed cybersecurity into your engineering and business processes.',
      ],
      slogan: 'secureXmotive — Securing the Machines That Build, Move, Mine, and Harvest.',
    },
    items: [
      'Machine and vehicle cybersecurity assessments',
      'Threat Analysis and Risk Assessment',
      'Cybersecurity architecture',
      'ECU and controller security',
      'CAN, Ethernet and network security',
      'Telematics and remote-access security',
      'Diagnostic security',
      'Penetration testing',
      'Vulnerability assessment',
      'OTA update security',
      'Secure communications',
      'Fleet cybersecurity',
      'Autonomous-machine security assessment',
      'Incident response planning',
      'Cybersecurity process and governance',
    ].map((title) => ({ slug: slugify(title), title })),
  },
  {
    slug: 'commercial-vehicles',
    slugAliases: ['penetration-testing', 'commercial', 'commercial-vehicle-cybersecurity'],
    index: '04',
    label: 'COMMERCIAL',
    name: 'Commercial Vehicle Cybersecurity',
    accent: 'red',
    tagline: 'Protect the Vehicles That Keep Businesses Moving.',
    summary:
      'Trucks, buses, coaches, delivery vehicles, and other commercial vehicles are rapidly evolving into connected digital platforms. secureXmotive helps manufacturers protect vehicles, fleets, infrastructure, and connected services against evolving cyber threats.',
    intro:
      'Trucks, buses, coaches, delivery vehicles, and other commercial vehicles are rapidly evolving into connected digital platforms. Telematics, fleet management, remote diagnostics, ADAS, infotainment, connected services, electronic control units, and OTA updates are transforming how commercial fleets operate.\n\nBut every new connection introduces another potential cybersecurity risk.\n\nsecureXmotive helps truck, bus, and commercial vehicle manufacturers protect their vehicles, fleets, infrastructure, and connected services against evolving cyber threats.\n\nFor commercial fleets, cybersecurity is directly linked to business continuity. A cyber incident affecting vehicle availability, fleet management, remote services, logistics systems, or critical vehicle functions can create operational disruption, financial losses, safety concerns, and reputational damage.\n\nOur cybersecurity consultants help organizations understand and manage these risks throughout the vehicle lifecycle.\n\nsecureXmotive provides services covering TARA, cybersecurity architecture, secure vehicle design, ECU and network security, penetration testing, vulnerability management, secure diagnostics, telematics security, OTA security, incident response, and cybersecurity governance.\n\nWe assess attack surfaces across vehicle networks, diagnostic interfaces, telematics systems, cellular connectivity, Wi-Fi, Bluetooth, mobile applications, cloud platforms, fleet management systems, and backend infrastructure.\n\nCommercial vehicles also introduce unique cybersecurity considerations. A truck may remain connected for years, operate across multiple countries, interact with trailers and implements, and communicate continuously with fleet infrastructure. Buses may connect to passenger-facing systems, depot infrastructure, and public networks. These complex ecosystems require cybersecurity strategies that go beyond protecting individual ECUs.',
    video: '/gifs/commercial.mp4',
    standards: ['UN R155', 'UN R156', 'ISO/SAE 21434', 'SAE J1939', 'CSMS'],
    servicesHeading: 'Our Commercial Vehicle Cybersecurity Services',
    servicesList: [
      'Truck and bus cybersecurity assessment',
      'TARA and threat modelling',
      'Cybersecurity architecture',
      'CSMS implementation support',
      'ECU and network security',
      'Telematics cybersecurity',
      'Fleet management security',
      'Diagnostic security',
      'Penetration testing',
      'Vulnerability management',
      'OTA security',
      'Backend and cloud security assessment',
      'Connected trailer and implement security',
      'Incident response planning',
      'UN R155 and ISO/SAE 21434 support',
    ],
    closingSection: {
      title: 'Secure Vehicles. Secure Fleets. Secure Operations.',
      paragraphs: [
        'At secureXmotive, we understand that commercial vehicle cybersecurity must protect more than the vehicle itself. It must protect the entire ecosystem connecting vehicles, drivers, fleet operators, workshops, dealers, cloud platforms, and backend systems.',
        'Our objective is to help commercial vehicle manufacturers build cybersecurity into every stage of the product lifecycle while creating practical processes that can be implemented across large vehicle portfolios and global fleets.',
        'With secureXmotive, cybersecurity becomes an enabler of reliable, connected, and trusted transportation.',
      ],
      slogan: 'secureXmotive — Securing the Future of Commercial Mobility.',
    },
    items: [
      'Truck and bus cybersecurity assessment',
      'TARA and threat modelling',
      'Cybersecurity architecture',
      'CSMS implementation support',
      'ECU and network security',
      'Telematics cybersecurity',
      'Fleet management security',
      'Diagnostic security',
      'Penetration testing',
      'Vulnerability management',
      'OTA security',
      'Backend and cloud security assessment',
      'Connected trailer and implement security',
      'Incident response planning',
      'UN R155 and ISO/SAE 21434 support',
    ].map((title) => ({ slug: slugify(title), title })),
  },
  {
    slug: 'industrial-control-systems',
    slugAliases: ['security-architecture', 'industrial-ot', 'industrial-control-systems-cybersecurity', 'ics-cybersecurity'],
    index: '05',
    label: 'INDUSTRIAL OT',
    name: 'Industrial Control Systems Cybersecurity',
    accent: 'purple',
    tagline: 'Protect Critical Operations. Secure the Systems That Run Industry.',
    summary:
      'Industrial organizations increasingly depend on connected Operational Technology (OT), Industrial Control Systems (ICS), SCADA platforms, and PLCs. secureXmotive provides specialized cybersecurity consulting services to protect industrial control environments without disrupting production.',
    intro:
      'Industrial organizations increasingly depend on connected Operational Technology (OT), Industrial Control Systems (ICS), SCADA platforms, PLCs, HMIs, industrial networks, remote-access systems, sensors, and connected machinery.\n\nWhile connectivity improves efficiency and enables digital transformation, it also introduces cybersecurity risks into environments where availability, safety, and operational continuity are critical.\n\nsecureXmotive provides specialized cybersecurity consulting services for organizations looking to protect their industrial control environments against modern cyber threats.\n\nUnlike traditional IT environments, industrial systems often operate continuously and control physical processes. A cybersecurity incident can therefore have consequences extending beyond data loss—including production shutdowns, equipment damage, safety incidents, environmental impact, and significant financial losses.\n\nsecureXmotive takes an OT-focused approach to cybersecurity, recognizing the unique requirements of industrial environments. We help organizations understand their OT attack surface, identify vulnerabilities, establish appropriate security controls, and improve cyber resilience without unnecessarily disrupting production.\n\nOur services include OT cybersecurity assessments, ICS security architecture, network segmentation, threat modelling, vulnerability assessment, penetration testing, security monitoring, remote-access security, incident response, and cybersecurity governance.\n\nWe assess industrial environments across PLCs, RTUs, HMIs, SCADA systems, engineering workstations, industrial Ethernet, legacy protocols, gateways, remote-access solutions, and connections between IT and OT networks.\n\nA critical component of OT cybersecurity is segmentation. If an attacker compromises an IT system, weak boundaries between IT and OT can allow the attack to move toward industrial control systems. secureXmotive helps organizations establish appropriate zones, conduits, access controls, monitoring, and security architecture.',
    video: '/gifs/industry.mp4',
    standards: ['IEC 62443', 'SCADA / PLC', 'Purdue Model', 'IT/OT Segmentation', 'Industrial Ethernet'],
    servicesHeading: 'Our Industrial Cybersecurity Services',
    servicesList: [
      'OT and ICS cybersecurity assessments',
      'Industrial network security',
      'SCADA and PLC security assessment',
      'OT threat modelling and risk assessment',
      'Network segmentation',
      'IT/OT security architecture',
      'Vulnerability assessment',
      'Penetration testing',
      'Remote-access security',
      'Secure industrial communications',
      'Security monitoring strategy',
      'Incident response and cyber resilience',
      'OT cybersecurity governance',
      'IEC 62443 implementation support',
      'Cybersecurity maturity assessments',
    ],
    closingSection: {
      title: 'Security Without Compromising Operations',
      paragraphs: [
        'Industrial cybersecurity is not simply about deploying more security tools. It requires an understanding of people, processes, technology, industrial operations, and safety.',
        'secureXmotive combines cybersecurity expertise with an understanding of connected industrial environments to help organizations build practical and sustainable security programs.',
        'Whether you are modernizing an existing plant, connecting legacy equipment, deploying new automation systems, or building a new industrial facility, secureXmotive helps you identify cyber risks before they become operational problems.',
      ],
      slogan: 'secureXmotive — Securing the Systems That Keep Industry Running.',
    },
    items: [
      'OT and ICS cybersecurity assessments',
      'Industrial network security',
      'SCADA and PLC security assessment',
      'OT threat modelling and risk assessment',
      'Network segmentation',
      'IT/OT security architecture',
      'Vulnerability assessment',
      'Penetration testing',
      'Remote-access security',
      'Secure industrial communications',
      'Security monitoring strategy',
      'Incident response and cyber resilience',
      'OT cybersecurity governance',
      'IEC 62443 implementation support',
      'Cybersecurity maturity assessments',
    ].map((title) => ({ slug: slugify(title), title })),
  },
]

export const getServiceDomain = (slug: string): ServiceDomain | undefined =>
  serviceDomains.find((domain) => domain.slug === slug || domain.slugAliases?.includes(slug))

/** The domain after slug, or undefined for the last one — the design shows no wrap-around. */
export const getNextServiceDomain = (slug: string): ServiceDomain | undefined => {
  const position = serviceDomains.findIndex(
    (domain) => domain.slug === slug || domain.slugAliases?.includes(slug),
  )
  return position === -1 ? undefined : serviceDomains[position + 1]
}
