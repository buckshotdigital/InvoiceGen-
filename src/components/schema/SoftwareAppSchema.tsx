export function SoftwareAppSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "InvoiceGen",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "Free professional invoice generator for freelancers and small businesses",
    url: "https://invoice-gen-two-rho.vercel.app",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "523",
    },
    featureList: [
      "Free invoice generation",
      "Professional PDF export",
      "Multiple currencies support",
      "Automatic invoice numbering",
      "Tax calculations",
      "Local storage (no signup required)",
      "Premium features with custom branding",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
