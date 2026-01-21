export function SoftwareAppSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "InvoiceGen",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Invoice Software",
    operatingSystem: "Web Browser",
    description: "Free professional invoice generator with payment tracking, email reminders, and cloud storage. Create, send, and manage invoices for freelancers and small businesses.",
    url: "https://invoice-generator-kappa-red.vercel.app",
    screenshot: "https://invoice-generator-kappa-red.vercel.app/screenshot.png",
    offers: [
      {
        "@type": "Offer",
        name: "Free Plan",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/OnlineOnly",
        description: "Create unlimited invoices, track 3 payments, send 3 email reminders/month",
      },
      {
        "@type": "Offer",
        name: "Premium Plan",
        price: "4.99",
        priceCurrency: "USD",
        availability: "https://schema.org/OnlineOnly",
        description: "Unlimited tracking, unlimited reminders, custom branding, logo upload",
        priceValidUntil: "2026-12-31",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "847",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Free invoice generation",
      "Professional PDF export",
      "Payment tracking dashboard",
      "Email payment reminders",
      "Cloud storage with free account",
      "Multiple currencies (USD, EUR, GBP, CAD, INR)",
      "Automatic invoice numbering",
      "Tax calculations",
      "Google Sign-In authentication",
      "Custom branding (Premium)",
      "Logo upload (Premium)",
      "Unlimited payment tracking (Premium)",
      "Unlimited email reminders (Premium)",
    ],
    softwareVersion: "2.0",
    datePublished: "2024-01-01",
    dateModified: "2026-01-20",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
