import ApiDocumentationClient from "./ApiDocumentationClient";

export function generateStaticParams() {
  return ["document-retrieval"].map((apiId) => ({ apiId }));
}

export default function ApiDocumentationPage({
  params,
}: {
  params: Promise<{ apiId: string }>;
}) {
  return <ApiDocumentationClient params={params} />;
}
