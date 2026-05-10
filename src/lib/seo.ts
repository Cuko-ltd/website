export const SITE_URL = 'https://cuko.uk';
export const BOOKING_URL = 'https://calendar.app.google/6cpfUFXXNWYrquBa7';
export const CTA_LABEL = 'Book a discovery call';

export const PERSON = {
  name: 'Samuel Ventimiglia',
  jobTitle: 'Fractional Chief Technology Officer',
  url: SITE_URL,
  email: 'samuel@cuko.uk',
  image: `${SITE_URL}/samuel-ventimiglia.jpg`,
  knowsLanguage: ['en', 'it'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'London',
    addressCountry: 'GB',
  },
  sameAs: [
    'https://www.linkedin.com/in/ventimigliasamuel/',
    'https://github.com/Cuko-ltd',
  ],
} as const;

export const ORGANIZATION = {
  name: 'Cuko Ltd',
  legalName: 'Cuko Ltd',
  url: SITE_URL,
  email: 'samuel@cuko.uk',
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.svg`,
    width: 200,
    height: 40,
  },
  foundingDate: '2026',
  founders: [{ '@type': 'Person', name: 'Samuel Ventimiglia' }],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '58 Twyford Avenue',
    postalCode: 'W3 9QB',
    addressLocality: 'London',
    addressCountry: 'GB',
  },
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'UK Companies House',
    value: '14989953',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'samuel@cuko.uk',
    availableLanguage: ['en', 'it'],
    areaServed: 'Worldwide',
  },
  areaServed: 'Worldwide',
} as const;

export const SECTORS = [
  'Crypto-native finance',
  'Healthcare',
  'AI and agent infrastructure',
  'Cloud-native strategy and implementation',
] as const;

export const SERVICES = [
  {
    name: 'Hands-on build lead',
    description:
      'Senior engineering capacity that ships code alongside the in-house team, taking ownership of architecture, infrastructure, and the hard parts of the codebase.',
  },
  {
    name: '0→1 architecture and stack selection',
    description:
      'Greenfield system design, build-versus-buy assessment, and technology selection that holds up under investor and regulatory scrutiny.',
  },
  {
    name: 'AI integration and development',
    description:
      'Embedding LangChain-based agents, retrieval pipelines, and inference layers into existing products; greenfield agentic systems where the agent is the product. Practical experience with LangChain, TensorFlow, and the integration layer between AI capabilities and regulated production systems.',
  },
  {
    name: 'Compliance-first system design',
    description:
      'GDPR, DORA, MiCA, and EU AI Act-aligned architecture with audit trails, data residency, and breach posture designed in from day one. See the regulatory compliance page for article-level deliverables.',
  },
  {
    name: 'Crisis recovery',
    description:
      'Recovery of stalled engineering projects, post-incident infrastructure rebuilds, and remediation of systems that have outgrown their original design.',
  },
  {
    name: 'Engineering team scaling and hiring',
    description:
      'Team structure, hiring loop design, and senior network access to grow engineering organisations without losing founder mental model.',
  },
  {
    name: 'Technical due diligence',
    description:
      'Pre-investment review of code, infrastructure, and engineering team for venture investors and strategic acquirers.',
  },
  {
    name: 'Advisor',
    description:
      'Monthly retainer with board attendance and structured technical input for organisations with an existing CTO seeking a senior second voice.',
  },
] as const;

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    ...PERSON,
    worksFor: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...ORGANIZATION,
  };
}

export function professionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Cuko Ltd — Fractional Hands-On CTO',
    url: SITE_URL,
    description:
      'Fractional Chief Technology Officer services for crypto-native finance, healthcare, AI infrastructure, and cloud-native scale-ups. Hands-on, compliance-aware, and delivered through Cuko Ltd.',
    provider: {
      '@type': 'Person',
      name: PERSON.name,
      jobTitle: PERSON.jobTitle,
    },
    areaServed: ORGANIZATION.areaServed,
    serviceType: SERVICES.map((s) => s.name),
    knowsAbout: [
      ...SECTORS,
      'GDPR',
      'DORA',
      'MiCA',
      'EU AI Act',
      'Real-time systems',
      'High-frequency trading infrastructure',
      'Kubernetes',
      'AWS',
      'Google Cloud',
      'Go programming language',
      'Python',
      'LangChain',
      'Apache Kafka',
      'NATS JetStream',
    ],
    address: ORGANIZATION.address,
  };
}

export function faqPageSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cuko Ltd',
    alternateName: 'Cuko',
    url: SITE_URL,
    description:
      'Fractional Chief Technology Officer services delivered by Samuel Ventimiglia through Cuko Ltd.',
    inLanguage: 'en-GB',
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webPageSchema(opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Cuko Ltd',
      url: SITE_URL,
    },
    inLanguage: 'en-GB',
  };
}
