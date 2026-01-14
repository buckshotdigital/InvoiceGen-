interface ArticleSchemaProps {
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate: string;
  authorName?: string;
  imageUrl?: string;
}

export function ArticleSchema(props: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: props.title,
    description: props.description,
    datePublished: props.publishedDate,
    dateModified: props.modifiedDate,
    author: {
      "@type": "Organization",
      name: props.authorName || "InvoiceGen Team",
      url: "https://invoice-gen-two-rho.vercel.app",
    },
    publisher: {
      "@type": "Organization",
      name: "InvoiceGen",
      logo: {
        "@type": "ImageObject",
        url: "https://invoice-gen-two-rho.vercel.app/logo.png",
      },
    },
    ...(props.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: props.imageUrl,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
