import { organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/schema";

export function SchemaScript() {
  const schemas = [organizationSchema(), localBusinessSchema(), websiteSchema()];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
