import { useState } from "react";

// Interface para os cabeçalhos
export interface Header {
  key: string;
  value: string;
}

// Interface para o estado da resposta
export interface ApiResponse {
  status: number | null;
  statusText: string | null;
  headers: Record<string, string> | null;
  body: string | null;
  parsedBody: any | null;
  error: string | null;
}

// Estado inicial da resposta
const initialApiResponse: ApiResponse = {
  status: null,
  statusText: null,
  headers: null,
  body: null,
  parsedBody: null,
  error: null,
};

export function useApiRequester() {
  // Estados da requisição
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([{ key: "", value: "" }]);
  const [requestBody, setRequestBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados da resposta
  const [apiResponse, setApiResponse] = useState<ApiResponse>(initialApiResponse);
  const [activeTab, setActiveTab] = useState("response");

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const getMethodColor = (m: string) => {
    switch (m) {
      case "GET":
        return "text-[#66d9ff]";
      case "POST":
        return "text-[#00ff41]";
      case "PUT":
        return "text-[#ffff00]";
      case "DELETE":
        return "text-[#ff4444]";
      case "PATCH":
        return "text-[#66d9ff]";
      default:
        return "text-[#888888]";
    }
  };

  const executeRequest = async () => {
    setIsLoading(true);
    setApiResponse(initialApiResponse); // Limpa a resposta anterior

    try {
      const formattedHeaders = new Headers();
      headers.forEach((header) => {
        if (header.key && header.value) {
          formattedHeaders.append(header.key, header.value);
        }
      });

      const options: RequestInit = {
        method,
        headers: formattedHeaders,
      };

      // Adiciona o corpo da requisição apenas para métodos que o suportam
      const methodsWithBody = ["POST", "PUT", "PATCH"];
      if (methodsWithBody.includes(method) && requestBody) {
        options.body = requestBody;
        // Adiciona Content-Type se não estiver presente nos headers
        if (!formattedHeaders.has("Content-Type")) {
          formattedHeaders.append("Content-Type", "application/json");
        }
      }

      const response = await fetch(url, options);

      // Lê os headers da resposta
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const responseBodyText = await response.text();
      let parsedJson = null;
      let formattedBody = responseBodyText;

      try {
        parsedJson = JSON.parse(responseBodyText);
        formattedBody = JSON.stringify(parsedJson, null, 2);
      } catch (e) {
        // Se não for JSON, mantém o texto simples
      }

      setApiResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: formattedBody,
        parsedBody: parsedJson,
        error: null,
      });

      setActiveTab("response"); // Volta para a tab de resposta após a execução
    } catch (err) {
      const error = err as Error;
      setApiResponse({
        ...initialApiResponse,
        error: error.message || "An unknown error occurred.",
      });
      setActiveTab("status");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Estados
    method,
    setMethod,
    url,
    setUrl,
    headers,
    setHeaders,
    requestBody,
    setRequestBody,
    activeTab,
    setActiveTab,
    isLoading,
    apiResponse,
    // Funções
    addHeader,
    removeHeader,
    updateHeader,
    getMethodColor,
    executeRequest,
  };
}