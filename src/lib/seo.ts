export const SITE_URL = 'https://cuko.uk';

export const PERSON_ID = `${SITE_URL}/#person`;

export const PERSON = {
  name: 'Samuel Ventimiglia',
  jobTitle: 'Chief Technology Officer',
  worksForName: 'Campsor Capital',
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

export function personSchema() {
  const { worksForName, ...person } = PERSON;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    ...person,
    worksFor: {
      '@type': 'Organization',
      name: worksForName,
    },
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
    name: 'Samuel Ventimiglia',
    url: SITE_URL,
    description:
      'Personal site of Samuel Ventimiglia — Chief Technology Officer at Campsor Capital, based in London.',
    inLanguage: 'en-GB',
    author: {
      '@type': 'Person',
      '@id': PERSON_ID,
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
      name: 'Samuel Ventimiglia',
      url: SITE_URL,
    },
    inLanguage: 'en-GB',
  };
}
