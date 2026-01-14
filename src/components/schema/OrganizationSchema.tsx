export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "InvoiceGen",
    url: "https://invoice-gen-two-rho.vercel.app",
    logo: "https://invoice-gen-two-rho.vercel.app/logo.png",
    description: "Free professional invoice generator for freelancers and small businesses",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@invoicegen.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
