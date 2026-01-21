export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "InvoiceGen",
    url: "https://invoice-generator-kappa-red.vercel.app",
    logo: "https://invoice-generator-kappa-red.vercel.app/logo.png",
    description: "Free professional invoice generator with payment tracking and email reminders for freelancers and small businesses",
    foundingDate: "2024",
    sameAs: [
      "https://twitter.com/invoicegen",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "info@bdsalesinc.ca",
      availableLanguage: "English",
    },
    offers: {
      "@type": "Offer",
      name: "Free Plan",
      price: "0",
      priceCurrency: "USD",
      description: "Create invoices, track up to 3 payments, send 3 email reminders per month",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
