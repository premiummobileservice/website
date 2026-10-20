import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  schema?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Premium Mobile Repair | Doorstep Phone & Device Repair in Bangalore',
  description = 'Bangalore device repair with free pickup and delivery across Koramangala, Indiranagar, HSR Layout, Whitefield & all Bangalore. Diagnosis before quote, pay on satisfactory completion.',
  canonicalUrl = 'https://premiummobilerepair.in',
  schema,
}) => {
  const fullTitle = title.includes('Premium Mobile Repair') ? title : `${title} | Premium Mobile Repair`;

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Premium Mobile Repair',
    image: 'https://premiummobilerepair.in/og-image.jpg',
    telephone: '+91 93435 84460',
    email: 'contact@premiummobilerepair.in',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '#159, 1st Floor 32nd E Cross Rd, Tilak Nagar, Jayanagar',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560041',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 12.9276,
      longitude: 77.5912,
    },
    url: 'https://premiummobilerepair.in',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    areaServed: [
      'Bangalore',
      'Koramangala',
      'Indiranagar',
      'HSR Layout',
      'Whitefield',
      'Jayanagar',
      'Marathahalli',
      'Bellandur',
      'Electronic City',
    ],
  };

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="mobile repair Bangalore, iPhone repair Bangalore, screen replacement Bangalore, battery replacement Bangalore, device repair pickup delivery Bangalore, phone repair near me Bangalore"
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Premium Mobile Repair" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>
    </Helmet>
  );
};
