/**
 * Structured Data Utilities for Schema.org JSON-LD
 */

export interface BreadcrumbItem {
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

export interface CourseSchema {
  '@context': 'https://schema.org';
  '@type': 'Course';
  name: string;
  description?: string;
  url: string;
  provider: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
}

export interface WebsiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    url?: string;
  }[];
}

/**
 * Create breadcrumb schema
 */
export function createBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Create course schema
 */
export function createCourseSchema(
  name: string,
  url: string,
  description?: string
): CourseSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: 'Từ Đến',
      url: 'https://korean.tudencafe.com',
    },
  };
}

/**
 * Create website schema
 */
export function createWebsiteSchema(): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Từ Đến',
    url: 'https://korean.tudencafe.com',
    description: 'Tài nguyên học tiếng Hàn dành cho Ngọc Diệp — lộ trình ấm áp, bài học ngắn và hoạt động tương tác.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://korean.tudencafe.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Create organization schema
 */
export function createOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Từ Đến',
    url: 'https://korean.tudencafe.com',
    description: 'Learn Korean with a warm, step-by-step curriculum.',
    sameAs: ['https://tudencafe.com'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Learning Support',
        url: 'https://tudencafe.com',
      },
    ],
  };
}
