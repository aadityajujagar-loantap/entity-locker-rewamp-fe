"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Search,
  Download,
  Check,
  Clock,
  KeyRound,
  FileText,
  ChevronDown,
} from "lucide-react";

interface Endpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  label: string;
  description: string;
  queryParameters?: { name: string; type: string; required: boolean; description: string }[];
  headers?: { name: string; required: boolean; description: string }[];
  responses: { code: number; description: string; contentType: string }[];
  requestExample: {
    curl: string;
    nodejs: string;
    python: string;
  };
  responseExample: {
    json: string;
    binary?: string;
  };
}

interface ApiData {
  id: string;
  name: string;
  description: string;
  category: "Document" | "Verification" | "Account" | "Utility";
  version: string;
  status: string;
  tags: string[];
  baseUrl: string;
  rateLimit: string;
  updatedAt: string;
  authentication: string;
  endpoints: {
    documents: Endpoint[];
    utility: Endpoint[];
  };
}

const API_DETAILS_MAP: Record<string, ApiData> = {
  "document-retrieval": {
    id: "document-retrieval",
    name: "Document Retrieval API",
    description: "Retrieve digitally signed documents from Entity Locker using Document ID or Reference Number.",
    category: "Document",
    version: "v1.2.0",
    status: "Active",
    tags: ["documents", "retrieval", "pdf", "json", "digital-signature", "kyc"],
    baseUrl: "https://api.bankofmaharashtra.in/el/v1",
    rateLimit: "100 requests per minute",
    updatedAt: "28 May 2024",
    authentication: "API Key / OAuth 2.0",
    endpoints: {
      documents: [
        {
          id: "get-documents-retrieve",
          method: "GET",
          path: "/v1/documents/retrieve",
          label: "Retrieve Document",
          description: "Retrieve a digitally signed document using Document ID or Reference Number.",
          queryParameters: [
            { name: "docId", type: "string", required: true, description: "Document ID issued by Entity Locker" },
            { name: "refNumber", type: "string", required: false, description: "Reference Number of the document" },
            { name: "docType", type: "string", required: false, description: "Type of document (e.g., PAN, AADHAAR)" },
            { name: "includeMeta", type: "boolean", required: false, description: "Include document metadata in response. Default: false" },
          ],
          headers: [
            { name: "X-API-Key", required: true, description: "API Key issued to the subscriber" },
            { name: "X-Request-ID", required: false, description: "Unique request ID for tracking" },
          ],
          responses: [
            { code: 200, description: "Success - Document retrieved", contentType: "application/json, application/pdf" },
            { code: 400, description: "Bad Request - Invalid parameters", contentType: "application/json" },
            { code: 401, description: "Unauthorized - Invalid or missing API Key", contentType: "application/json" },
            { code: 404, description: "Not Found - Document not found", contentType: "application/json" },
            { code: 500, description: "Internal Server Error", contentType: "application/json" },
          ],
          requestExample: {
            curl: `curl --location --request GET \\
'https://api.bankofmaharashtra.in/el/v1/documents/retrieve' \\
--header 'X-API-Key: {{api_key}}' \\
--header 'X-Request-ID: {{request_id}}' \\
--header 'Accept: application/json' \\
--data-urlencode 'docId=DOC123456789' \\
--data-urlencode 'docType=PAN' \\
--data-urlencode 'includeMeta=true'`,
            nodejs: `const axios = require('axios');

const config = {
  method: 'get',
  url: 'https://api.bankofmaharashtra.in/el/v1/documents/retrieve?docId=DOC123456789&docType=PAN&includeMeta=true',
  headers: { 
    'X-API-Key': '{{api_key}}', 
    'X-Request-ID': '{{request_id}}', 
    'Accept': 'application/json'
  }
};

axios(config)
  .then(response => console.log(JSON.stringify(response.data)))
  .catch(error => console.log(error));`,
            python: `import requests

url = "https://api.bankofmaharashtra.in/el/v1/documents/retrieve"
params = {
    "docId": "DOC123456789",
    "docType": "PAN",
    "includeMeta": "true"
}
headers = {
    "X-API-Key": "{{api_key}}",
    "X-Request-ID": "{{request_id}}",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers, params=params)
print(response.json())`,
          },
          responseExample: {
            json: `{
  "status": "success",
  "data": {
    "docId": "DOC123456789",
    "docType": "PAN",
    "fileName": "PAN_DOC123456789.pdf",
    "mimeType": "application/pdf",
    "fileContent": "JVBERi0xLjQKJcfs...",
    "digitalSignature": {
      "signedBy": "Entity Locker",
      "signedOn": "2024-05-28T10:15:30Z",
      "hashAlgorithm": "SHA256"
    }
  },
  "meta": {
    "issuedBy": "Income Tax Department",
    "issuedOn": "2024-05-20",
    "validTill": "2025-05-19"
  }
}`,
            binary: `%PDF-1.4
%âãÏÓ
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
...
[PDF Binary Data Output]`,
          },
        },
        {
          id: "post-documents-verify",
          method: "POST",
          path: "/v1/documents/verify",
          label: "Verify Document",
          description: "Verify the integrity and digital signature of a document.",
          queryParameters: [
            { name: "fileContent", type: "string", required: true, description: "Base64 encoded file content" },
            { name: "signature", type: "string", required: false, description: "Detached digital signature if not embedded" },
          ],
          headers: [
            { name: "X-API-Key", required: true, description: "API Key issued to the subscriber" },
          ],
          responses: [
            { code: 200, description: "Success - Document signature is valid", contentType: "application/json" },
            { code: 400, description: "Bad Request - Invalid signature or corrupted file", contentType: "application/json" },
          ],
          requestExample: {
            curl: `curl --location --request POST \\
'https://api.bankofmaharashtra.in/el/v1/documents/verify' \\
--header 'X-API-Key: {{api_key}}' \\
--header 'Content-Type: application/json' \\
--data-raw '{
  "fileContent": "JVBERi0xLjQKJcfs...",
  "signature": "MEQCID..."
}'`,
            nodejs: `const axios = require('axios');

const data = JSON.stringify({
  "fileContent": "JVBERi0xLjQKJcfs...",
  "signature": "MEQCID..."
});

const config = {
  method: 'post',
  url: 'https://api.bankofmaharashtra.in/el/v1/documents/verify',
  headers: { 
    'X-API-Key': '{{api_key}}', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
  .then(response => console.log(JSON.stringify(response.data)))
  .catch(error => console.log(error));`,
            python: `import requests
import json

url = "https://api.bankofmaharashtra.in/el/v1/documents/verify"
headers = {
    "X-API-Key": "{{api_key}}",
    "Content-Type": "application/json"
}
payload = {
    "fileContent": "JVBERi0xLjQKJcfs...",
    "signature": "MEQCID..."
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`,
          },
          responseExample: {
            json: `{
  "status": "success",
  "message": "Document signature verified successfully.",
  "data": {
    "isValid": true,
    "signedBy": "Entity Locker",
    "signedOn": "2024-05-28T10:15:30Z",
    "hashAlgorithm": "SHA256"
  }
}`,
          },
        },
        {
          id: "get-documents-status",
          method: "GET",
          path: "/v1/documents/{docId}/status",
          label: "Get Document Status",
          description: "Check status of a document (e.g. Active, Suspended, Revoked).",
          queryParameters: [
            { name: "docId", type: "string", required: true, description: "Document ID to query" },
          ],
          headers: [
            { name: "X-API-Key", required: true, description: "API Key" },
          ],
          responses: [
            { code: 200, description: "Success", contentType: "application/json" },
          ],
          requestExample: {
            curl: `curl --location --request GET \\
'https://api.bankofmaharashtra.in/el/v1/documents/DOC123456789/status' \\
--header 'X-API-Key: {{api_key}}'`,
            nodejs: `const axios = require('axios');

const config = {
  method: 'get',
  url: 'https://api.bankofmaharashtra.in/el/v1/documents/DOC123456789/status',
  headers: { 
    'X-API-Key': '{{api_key}}'
  }
};

axios(config)
  .then(response => console.log(JSON.stringify(response.data)));`,
            python: `import requests

url = "https://api.bankofmaharashtra.in/el/v1/documents/DOC123456789/status"
headers = {
    "X-API-Key": "{{api_key}}"
}

response = requests.get(url, headers=headers)
print(response.json())`,
          },
          responseExample: {
            json: `{
  "status": "success",
  "data": {
    "docId": "DOC123456789",
    "status": "Active",
    "lastChecked": "2024-05-29T11:20:10Z"
  }
}`,
          },
        },
        {
          id: "get-documents-metadata",
          method: "GET",
          path: "/v1/documents/{docId}/metadata",
          label: "Get Document Metadata",
          description: "Retrieve issuer, issuance date, and validity metadata of a document.",
          queryParameters: [
            { name: "docId", type: "string", required: true, description: "Document ID" },
          ],
          headers: [
            { name: "X-API-Key", required: true, description: "API Key" },
          ],
          responses: [
            { code: 200, description: "Success", contentType: "application/json" },
          ],
          requestExample: {
            curl: `curl --location --request GET \\
'https://api.bankofmaharashtra.in/el/v1/documents/DOC123456789/metadata' \\
--header 'X-API-Key: {{api_key}}'`,
            nodejs: `const axios = require('axios');

const config = {
  method: 'get',
  url: 'https://api.bankofmaharashtra.in/el/v1/documents/DOC123456789/metadata',
  headers: { 
    'X-API-Key': '{{api_key}}'
  }
};

axios(config)
  .then(response => console.log(JSON.stringify(response.data)));`,
            python: `import requests

url = "https://api.bankofmaharashtra.in/el/v1/documents/DOC123456789/metadata"
headers = {
    "X-API-Key": "{{api_key}}"
}

response = requests.get(url, headers=headers)
print(response.json())`,
          },
          responseExample: {
            json: `{
  "status": "success",
  "data": {
    "docId": "DOC123456789",
    "issuer": "Income Tax Department",
    "issuedOn": "2024-05-20",
    "validTill": "2025-05-19",
    "metadata": {
      "panNumber": "ABCDE1234F",
      "holderName": "JOHN DOE"
    }
  }
}`,
          },
        },
      ],
      utility: [
        {
          id: "get-utility-health",
          method: "GET",
          path: "/v1/health",
          label: "Health Check",
          description: "Check system status and latency.",
          responses: [
            { code: 200, description: "System is healthy", contentType: "application/json" },
          ],
          requestExample: {
            curl: `curl --location --request GET \\
'https://api.bankofmaharashtra.in/el/v1/health'`,
            nodejs: `const axios = require('axios');

axios.get('https://api.bankofmaharashtra.in/el/v1/health')
  .then(response => console.log(response.data));`,
            python: `import requests

response = requests.get("https://api.bankofmaharashtra.in/el/v1/health")
print(response.json())`,
          },
          responseExample: {
            json: `{
  "status": "healthy",
  "timestamp": "2024-05-29T12:00:00Z",
  "uptime": "99.99%"
}`,
          },
        },
        {
          id: "get-utility-config",
          method: "GET",
          path: "/v1/config",
          label: "Get Configuration",
          description: "Retrieve active API version, client configuration parameters, and supported document types.",
          responses: [
            { code: 200, description: "Success", contentType: "application/json" },
          ],
          requestExample: {
            curl: `curl --location --request GET \\
'https://api.bankofmaharashtra.in/el/v1/config'`,
            nodejs: `const axios = require('axios');

axios.get('https://api.bankofmaharashtra.in/el/v1/config')
  .then(response => console.log(response.data));`,
            python: `import requests

response = requests.get("https://api.bankofmaharashtra.in/el/v1/config")
print(response.json())`,
          },
          responseExample: {
            json: `{
  "status": "success",
  "data": {
    "version": "v1.2.0",
    "supportedDocTypes": ["PAN", "AADHAAR", "VOTER_ID", "DRIVING_LICENSE"],
    "maxFileSize": "10MB"
  }
}`,
          },
        },
      ],
    },
  },
};

// Fallback dynamic API content if not document-retrieval
const getFallbackApiData = (apiId: string): ApiData => {
  const name = apiId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    id: apiId,
    name: name,
    description: `API Documentation for ${name}. Easily integrate and manage subscriptions.`,
    category: "Verification",
    version: "v1.0.0",
    status: "Active",
    tags: [apiId, "api", "mahabank"],
    baseUrl: `https://api.bankofmaharashtra.in/${apiId}/v1`,
    rateLimit: "100 requests per minute",
    updatedAt: "29 June 2026",
    authentication: "API Key / OAuth 2.0",
    endpoints: {
      documents: [
        {
          id: "get-default",
          method: "GET",
          path: "/v1/data",
          label: "Retrieve Data",
          description: "Retrieve data resources.",
          responses: [{ code: 200, description: "Success", contentType: "application/json" }],
          requestExample: {
            curl: `curl --location --request GET 'https://api.bankofmaharashtra.in/${apiId}/v1/data' --header 'X-API-Key: {{api_key}}'`,
            nodejs: `// nodejs snippet`,
            python: `# python snippet`,
          },
          responseExample: { json: `{\n  "status": "success"\n}` },
        },
      ],
      utility: [],
    },
  };
};

export default function ApiDocumentationPage({ params }: { params: Promise<{ apiId: string }> }) {
  const resolvedParams = use(params);
  const apiId = resolvedParams.apiId;

  // State
  const [activeTab, setActiveTab] = useState<"Overview" | "Endpoints" | "Request/Response" | "Schema" | "Error Codes" | "Changelog">("Endpoints");
  const [endpointSearch, setEndpointSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"curl" | "nodejs" | "python">("curl");
  const [responseTab, setResponseTab] = useState<"json" | "binary">("json");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Get active API
  const apiData = useMemo(() => {
    return API_DETAILS_MAP[apiId] || getFallbackApiData(apiId);
  }, [apiId]);

  // First endpoint defaults
  const defaultEndpoint = useMemo(() => {
    return apiData.endpoints.documents[0] || apiData.endpoints.utility[0];
  }, [apiData]);

  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(defaultEndpoint?.id || "");

  // Filter endpoints based on search
  const filteredEndpoints = useMemo(() => {
    const filterFn = (ep: Endpoint) =>
      ep.label.toLowerCase().includes(endpointSearch.toLowerCase()) ||
      ep.path.toLowerCase().includes(endpointSearch.toLowerCase());

    return {
      documents: apiData.endpoints.documents.filter(filterFn),
      utility: apiData.endpoints.utility.filter(filterFn),
    };
  }, [apiData, endpointSearch]);

  // Find active endpoint
  const activeEndpoint = useMemo(() => {
    const all = [...apiData.endpoints.documents, ...apiData.endpoints.utility];
    return all.find((ep) => ep.id === selectedEndpointId) || defaultEndpoint;
  }, [apiData, selectedEndpointId, defaultEndpoint]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-[#ecfdf3] text-[#16a34a] border-[#bbf7d0]";
      case "POST":
        return "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]";
      case "PUT":
        return "bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]";
      case "DELETE":
        return "bg-[#fff1f2] text-[#ef4444] border-[#fecaca]";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Regex-based Syntax Highlighters for extreme visual precision
  const highlightJson = (jsonStr: string) => {
    return jsonStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
        let cls = "text-[#f43f5e]"; // numbers/default
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-[#7dd3fc]"; // keys
          } else {
            cls = "text-[#86efac]"; // strings
          }
        } else if (/true|false/.test(match)) {
          cls = "text-[#fdba74]"; // booleans
        } else if (/null/.test(match)) {
          cls = "text-[#94a3b8]"; // nulls
        }
        return `<span class="${cls}">${match}</span>`;
      });
  };

  const highlightCurl = (curlStr: string) => {
    return curlStr
      .replace(/(curl|--location|--request|--header|--data-urlencode)/g, '<span class="text-[#f43f5e] font-bold">$1</span>')
      .replace(/('[^']*')/g, '<span class="text-[#86efac]">$1</span>');
  };

  const highlightGenericCode = (code: string) => {
    return code
      .replace(/(const|require|import|from|print|requests|url|headers|params|payload|data|axios|response)/g, '<span class="text-[#f43f5e] font-bold">$1</span>')
      .replace(/('[^']*'|"[^"]*")/g, '<span class="text-[#86efac]">$1</span>');
  };

  const getHighlightedCode = (codeStr: string, lang: string) => {
    if (lang === "curl") return highlightCurl(codeStr);
    return highlightGenericCode(codeStr);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-2 p-2 animate-fade-in">
      {/* Back Link */}
      <Link
        href="/dashboard/api-management/api-catalog"
        className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold text-[#0089CF] hover:underline cursor-pointer"
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        <span>Back to API Catalog</span>
      </Link>

      {/* API Header Banner */}
      <div className="rounded-[16px] border border-[#e3e4ee] bg-white p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)] grid grid-cols-1 lg:grid-cols-[1.48fr_1.2fr_0.82fr] gap-6 items-start">
        {/* Left col */}
        <div className="flex gap-4.5 items-start">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]">
            <FileText size={24} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-[17px] font-extrabold text-[#10142d]">{apiData.name}</h1>
              <span className="inline-flex rounded-[4px] bg-[#ecfdf3] px-2 py-0.5 text-[9.5px] font-extrabold text-[#16a34a]">
                {apiData.status}
              </span>
              <span className="inline-flex rounded-[4px] bg-[#eff6ff] px-2 py-0.5 text-[9.5px] font-extrabold text-[#2563eb]">
                {apiData.version}
              </span>
            </div>
            <p className="text-[13px] font-semibold text-[#5e6272] leading-[1.45] max-w-[500px]">
              {apiData.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {apiData.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[4px] bg-[#f1f3f9] px-2 py-0.5 text-[10px] font-bold text-[#5e6272]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Middle col */}
        <div className="space-y-3.5 lg:border-l lg:border-r lg:border-[#e3e4ee] lg:px-6">
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-[#5e6272] uppercase tracking-wide">Base URL</h4>
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={apiData.baseUrl}
                className="w-full h-[32px] rounded-[6px] border border-[#e3e4ee] bg-[#f8fafc] pl-3 pr-9 text-[11.5px] font-extrabold text-[#10142d] focus:outline-none"
              />
              <button
                onClick={() => handleCopy(apiData.baseUrl, "baseUrl")}
                className="absolute right-2.5 p-1 text-[#9094a8] hover:text-[#10142d] cursor-pointer transition-colors"
                title="Copy Base URL"
              >
                {copiedText === "baseUrl" ? <Check size={13.5} className="text-[#16a34a]" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center pt-0.5">
            <div>
              <h4 className="text-[11px] font-bold text-[#5e6272] uppercase tracking-wide">Authentication</h4>
              <p className="text-[13px] font-bold text-[#10142d] mt-0.5 flex items-center gap-1.5">
                <KeyRound size={13.5} className="text-[#5e6272]" />
                {apiData.authentication}
              </p>
            </div>
            <button className="rounded-[6px] bg-[#0072ad] px-4.5 py-1.8 text-[11px] font-extrabold text-white shadow-[0_2px_8px_rgba(0,114,173,0.15)] hover:bg-[#005f91] transition-all cursor-pointer h-[32px]">
              Subscribe to API
            </button>
          </div>
        </div>

        {/* Right col */}
        <div className="lg:pl-6 space-y-3.5">
          <div>
            <h4 className="text-[11px] font-bold text-[#5e6272] uppercase tracking-wide">Rate Limit</h4>
            <p className="text-[13px] font-extrabold text-[#10142d] mt-1 flex items-center gap-2">
              <Clock size={14.5} className="text-[#5e6272]" />
              {apiData.rateLimit}
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-[#5e6272] uppercase tracking-wide">Last Updated</h4>
            <p className="text-[13px] font-extrabold text-[#10142d] mt-1">
              {apiData.updatedAt}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e3e4ee] flex gap-7 overflow-x-auto scrollbar-none bg-transparent">
        {(["Overview", "Endpoints", "Request/Response", "Schema", "Error Codes", "Changelog"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-[36px] border-b-2 px-1 text-[13px] font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "border-[#0089CF] text-[#0089CF]"
                  : "border-transparent text-[#5e6272] hover:text-[#10142d]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "Endpoints" ? (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_370px] gap-2 items-start">
          
          {/* Left Column - Endpoint Navigation */}
          <aside className="rounded-[16px] border border-[#e3e4ee] bg-white p-3 shadow-[0_2px_12px_rgba(18,22,46,0.02)] flex flex-col space-y-3.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9094a8]" size={14} />
              <input
                type="text"
                placeholder="Search endpoints..."
                value={endpointSearch}
                onChange={(e) => setEndpointSearch(e.target.value)}
                className="w-full h-[30px] rounded-[5px] border border-[#e3e4ee] pl-8 pr-2.5 text-[12px] font-semibold text-[#10142d] placeholder-[#9094a8] focus:border-[#0089CF] focus:outline-none"
              />
            </div>

            {/* Documents Group */}
            {filteredEndpoints.documents.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-[#5e6272] uppercase tracking-wide px-1">
                  Documents
                </h4>
                <div className="space-y-0.5">
                  {filteredEndpoints.documents.map((ep) => {
                    const isActive = selectedEndpointId === ep.id;
                    return (
                      <button
                        key={ep.id}
                        onClick={() => setSelectedEndpointId(ep.id)}
                        className={`flex flex-col w-full text-left p-2 rounded-[6px] transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#eff6ff] border-l-[3px] border-[#0089CF] rounded-l-none"
                            : "hover:bg-[#f8fafc]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                            ep.method === "GET"
                              ? "bg-[#ecfdf3] text-[#16a34a] border-[#bbf7d0]"
                              : "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]"
                          }`}>
                            {ep.method}
                          </span>
                          <span className={`text-[12px] font-extrabold truncate ${isActive ? "text-[#0089CF]" : "text-[#10142d]"}`}>
                            {ep.path}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#5e6272] mt-0.5 pl-[32px] truncate">
                          {ep.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Utility Group */}
            {filteredEndpoints.utility.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-[#5e6272] uppercase tracking-wide px-1">
                  Utility
                </h4>
                <div className="space-y-0.5">
                  {filteredEndpoints.utility.map((ep) => {
                    const isActive = selectedEndpointId === ep.id;
                    return (
                      <button
                        key={ep.id}
                        onClick={() => setSelectedEndpointId(ep.id)}
                        className={`flex flex-col w-full text-left p-2 rounded-[6px] transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#eff6ff] border-l-[3px] border-[#0089CF] rounded-l-none"
                            : "hover:bg-[#f8fafc]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded border bg-[#ecfdf3] text-[#16a34a] border-[#bbf7d0]">
                            {ep.method}
                          </span>
                          <span className={`text-[12px] font-extrabold truncate ${isActive ? "text-[#0089CF]" : "text-[#10142d]"}`}>
                            {ep.path}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#5e6272] mt-0.5 pl-[32px] truncate">
                          {ep.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button className="flex items-center justify-center gap-2 border-t border-[#e3e4ee] pt-3 text-[12px] font-extrabold text-[#0089CF] hover:underline cursor-pointer">
              <Download size={13.5} />
              <span>Download OpenAPI Spec</span>
            </button>
          </aside>

          {/* Middle Column - Endpoint Details */}
          {activeEndpoint ? (
            <div className="rounded-[16px] border border-[#e3e4ee] bg-white p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)] space-y-5.5">
              <div>
                <h2 className="text-[15px] font-extrabold text-[#10142d]">{activeEndpoint.label}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${getMethodColor(activeEndpoint.method)}`}>
                    {activeEndpoint.method}
                  </span>
                  <span className="text-[13px] font-extrabold text-[#10142d] bg-[#f8fafc] px-2.5 py-0.5 rounded border border-[#e3e4ee]">
                    {activeEndpoint.path}
                  </span>
                </div>
                <p className="text-[13px] font-semibold text-[#5e6272] mt-3 leading-[1.5]">
                  {activeEndpoint.description}
                </p>
              </div>

              {/* Query Parameters */}
              {activeEndpoint.queryParameters && activeEndpoint.queryParameters.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[13px] font-extrabold text-[#10142d]">Query Parameters</h3>
                  <div className="overflow-hidden rounded-[6px] border border-[#e3e4ee]">
                    <table className="w-full border-collapse text-left text-[13px]">
                      <thead>
                        <tr className="h-[30px] border-b border-[#e3e4ee] bg-[#f8fafc] text-[11px] font-bold text-[#10142d] uppercase tracking-wide">
                          <th className="px-3 py-1 w-[22%]">Parameter</th>
                          <th className="px-3 py-1 w-[15%]">Type</th>
                          <th className="px-3 py-1 w-[15%]">Required</th>
                          <th className="px-3 py-1 w-[48%]">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e3e4ee]">
                        {activeEndpoint.queryParameters.map((param) => (
                          <tr key={param.name} className="h-[34px] font-semibold text-[#10142d]">
                            <td className="px-3 py-1 font-extrabold text-[#0089CF]">{param.name}</td>
                            <td className="px-3 py-1 text-[#5e6272] text-[11.5px]">{param.type}</td>
                            <td className="px-3 py-1">
                              <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                                param.required ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500"
                              }`}>
                                {param.required ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-3 py-1 text-[#5e6272] leading-[1.4] text-[12px]">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Headers */}
              {activeEndpoint.headers && activeEndpoint.headers.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[13px] font-extrabold text-[#10142d]">Headers</h3>
                  <div className="overflow-hidden rounded-[6px] border border-[#e3e4ee]">
                    <table className="w-full border-collapse text-left text-[13px]">
                      <thead>
                        <tr className="h-[30px] border-b border-[#e3e4ee] bg-[#f8fafc] text-[11px] font-bold text-[#10142d] uppercase tracking-wide">
                          <th className="px-3 py-1 w-[25%]">Header</th>
                          <th className="px-3 py-1 w-[18%]">Required</th>
                          <th className="px-3 py-1 w-[57%]">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e3e4ee]">
                        {activeEndpoint.headers.map((header) => (
                          <tr key={header.name} className="h-[34px] font-semibold text-[#10142d]">
                            <td className="px-3 py-1 font-extrabold text-[#10142d]">{header.name}</td>
                            <td className="px-3 py-1">
                              <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                                header.required ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500"
                              }`}>
                                {header.required ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-3 py-1 text-[#5e6272] leading-[1.4] text-[12px]">{header.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Responses */}
              <div className="space-y-2">
                <h3 className="text-[13px] font-extrabold text-[#10142d]">Responses</h3>
                <div className="overflow-hidden rounded-[6px] border border-[#e3e4ee]">
                  <table className="w-full border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="h-[30px] border-b border-[#e3e4ee] bg-[#f8fafc] text-[11px] font-bold text-[#10142d] uppercase tracking-wide">
                        <th className="px-3 py-1 w-[20%]">Status Code</th>
                        <th className="px-3 py-1 w-[50%]">Description</th>
                        <th className="px-3 py-1 w-[30%]">Content Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e3e4ee]">
                      {activeEndpoint.responses.map((resp) => {
                        const isSuccess = resp.code >= 200 && resp.code < 300;
                        return (
                          <tr key={resp.code} className="h-[34px] font-semibold text-[#10142d]">
                            <td className="px-3 py-1">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                                isSuccess ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                              }`}>
                                {resp.code}
                              </span>
                            </td>
                            <td className="px-3 py-1 text-[#5e6272] leading-[1.4] text-[12.5px]">{resp.description}</td>
                            <td className="px-3 py-1 text-[#5e6272] text-[12px]">{resp.contentType}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[16px] border border-[#e3e4ee] bg-white p-12 text-center text-[13px] font-bold text-[#5e6272]">
              No endpoint selected.
            </div>
          )}

          {/* Right Column - Code Panel */}
          {activeEndpoint && (
            <aside className="space-y-2">
              {/* Request Example */}
              <section className="overflow-hidden rounded-[16px] border border-slate-800 bg-[#0f141c] text-[12px] shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 px-3.5 py-2.5 bg-[#171f2c]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-300">Request Example</span>
                    <div className="relative">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value as any)}
                        className="h-[20px] appearance-none rounded bg-slate-800 border border-slate-700 pl-2 pr-5 text-[10.5px] font-bold text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="curl">Curl</option>
                        <option value="nodejs">Node.js</option>
                        <option value="python">Python</option>
                      </select>
                      <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(activeEndpoint.requestExample[selectedLanguage], "request")}
                    className="p-1 rounded text-slate-400 hover:text-white cursor-pointer hover:bg-slate-800"
                    title="Copy Request Example"
                  >
                    {copiedText === "request" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-3.5 overflow-x-auto font-mono text-slate-300 leading-[1.5] max-h-[250px] bg-[#0b0f19]">
                  <pre className="whitespace-pre">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: getHighlightedCode(activeEndpoint.requestExample[selectedLanguage], selectedLanguage),
                      }}
                    />
                  </pre>
                </div>
              </section>

              {/* Response Example */}
              <section className="overflow-hidden rounded-[16px] border border-slate-800 bg-[#0f141c] text-[12px] shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 px-3.5 py-2.5 bg-[#171f2c]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-300 mr-1.5">Response Example (200)</span>
                    <button
                      onClick={() => setResponseTab("json")}
                      className={`h-[20px] px-2.5 rounded text-[10.5px] font-bold transition-all cursor-pointer ${
                        responseTab === "json" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      JSON
                    </button>
                    {activeEndpoint.responseExample.binary && (
                      <button
                        onClick={() => setResponseTab("binary")}
                        className={`h-[20px] px-2.5 rounded text-[10.5px] font-bold transition-all cursor-pointer ${
                          responseTab === "binary" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        PDF (Binary)
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(
                      responseTab === "json"
                        ? activeEndpoint.responseExample.json
                        : activeEndpoint.responseExample.binary || "",
                      "response"
                    )}
                    className="p-1 rounded text-slate-400 hover:text-white cursor-pointer hover:bg-slate-800"
                    title="Copy Response Example"
                  >
                    {copiedText === "response" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-3.5 overflow-x-auto font-mono text-slate-300 leading-[1.5] max-h-[300px] bg-[#0b0f19]">
                  <pre className="whitespace-pre">
                    <code
                      dangerouslySetInnerHTML={{
                        __html:
                          responseTab === "json"
                            ? highlightJson(activeEndpoint.responseExample.json)
                            : activeEndpoint.responseExample.binary || "",
                      }}
                    />
                  </pre>
                </div>
              </section>
            </aside>
          )}
        </div>
      ) : (
        <div className="rounded-[16px] border border-[#e3e4ee] bg-white p-12 text-center text-[13.5px] font-bold text-[#5e6272] shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          {activeTab} documentation is currently being updated. Refer to the Endpoints tab for the full interactive API reference.
        </div>
      )}
    </div>
  );
}
