/**
 * Schema.org structured data helpers.
 * Used by page frontmatter to build consistent JSON-LD across the site.
 */

// --- Shared constants ---

export const PROVIDER = {
  "@type": "ProfessionalService" as const,
  "name": "Bertrand Brands \u2014 Brand & Web Systems",
  "url": "https://bertrandbrands.ca"
};

export const PROVIDER_FULL = {
  ...PROVIDER,
  "telephone": "+17054133705",
  "email": "hello@bertrandgroup.ca",
  "address": {
    "@type": "PostalAddress" as const,
    "addressLocality": "Greater Sudbury",
    "addressRegion": "Ontario",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates" as const,
    "latitude": 46.4917,
    "longitude": -80.9930
  },
  "sameAs": ["https://linkedin.com/in/sudburyon"]
};

export const AREA_SERVED = [
  {
    "@type": "City" as const,
    "name": "Greater Sudbury",
    "containedInPlace": { "@type": "AdministrativeArea" as const, "name": "Ontario" }
  },
  { "@type": "AdministrativeArea" as const, "name": "Northern Ontario" },
  { "@type": "Country" as const, "name": "Canada" }
];

// --- Builder functions ---

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Build a BreadcrumbList schema from an ordered array of items.
 * Each item gets an incremental position starting at 1.
 */
export function breadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList" as const,
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem" as const,
      "position": i + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Wrap multiple schema objects in a single @graph block.
 * Adds @context automatically — individual items should NOT include it.
 */
export function schemaGraph(...items: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": items
  };
}
