"use client";

import { useApiRequester } from "@/lib/useApiRequester";
import JsonHighlighter from "../components/ui/JsonHighlighter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Minus, Play, Loader2 } from "lucide-react";

import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";

const highlightWithPrism = (code: string) =>
  Prism.highlight(code, Prism.languages.json, "json");

export default function TerminalAPIRequester() {
  const {
    method,
    setMethod,
    url,
    setUrl,
    headers,
    requestBody,
    setRequestBody,
    activeTab,
    setActiveTab,
    isLoading,
    apiResponse,
    addHeader,
    removeHeader,
    updateHeader,
    getMethodColor,
    executeRequest,
  } = useApiRequester();
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (
      !hasInitialized.current &&
      (!requestBody || requestBody.trim() === "")
    ) {
      setRequestBody(`{
  "key": "value",
  "data": "example"
}`);
      hasInitialized.current = true;
    }
  }, [requestBody, setRequestBody]);
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff41] font-mono p-4">
      <div className="max-w-6xl mx-auto">
        {/* Terminal Window Header */}
        <div className="bg-[#111111] rounded-t-lg p-3 flex items-center gap-2 border-b border-[#555555]">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-[#ff4444] rounded-full"></div>
            <div className="w-3 h-3 bg-[#ffff00] rounded-full"></div>
            <div className="w-3 h-3 bg-[#00ff41] rounded-full"></div>
          </div>
          <div className="ml-4 text-[#ffffff] text-sm">
            {"> API_REQUESTER_TERMINAL v1.0.0"}
          </div>
        </div>

        {/* Main Terminal Content */}
        <div className="bg-[#0a0a0a] border-2 border-[#555555] rounded-b-lg p-6 space-y-6">
          {/* Command Line Prompt */}
          <div className="text-[#00ff41] text-sm mb-4 font-bold">
            {"user@terminal:~$ api-request --interactive"}
          </div>

          {/* Method and URL Section */}
          <Card className="bg-[#111111] border-[#555555]">
            <CardHeader className="pb-3">
              <div className="text-[#00ff41] text-sm font-bold">
                {"> REQUEST_CONFIG"}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="w-32">
                  <label className="text-[#00ff41] text-xs mb-2 block font-bold">
                    METHOD
                  </label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="bg-[#0a0a0a] border-[#555555] text-[#00ff41] font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#555555]">
                      {[
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "HEAD",
                        "OPTIONS",
                      ].map((m) => (
                        <SelectItem
                          key={m}
                          value={m}
                          className={`font-mono ${getMethodColor(
                            m
                          )} hover:bg-[#0a0a0a]`}
                        >
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-[#00ff41] text-xs mb-2 block font-bold">
                    URL
                  </label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                    className="bg-[#0a0a0a] border-[#555555] text-[#00ff41] font-mono placeholder:text-[#888888]"
                  />
                </div>
                <Button
                  className="bg-[#00ff41] hover:bg-[#00cc33] text-[#0a0a0a] font-mono font-bold px-6 h-10 shadow-[0_0_10px_#00ff41] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={executeRequest}
                  disabled={isLoading || !url}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "EXECUTING..." : "EXECUTE"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Headers Section */}
          <Card className="bg-[#111111] border-[#555555]">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="text-[#00ff41] text-sm font-bold">
                  {"> HEADERS"}
                </div>
                <Button
                  onClick={addHeader}
                  size="sm"
                  className="bg-[#555555] hover:bg-[#888888] text-[#00ff41] font-mono"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  ADD
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="text-[#888888] text-xs w-8">
                    {String(index + 1).padStart(2, "0")}:
                  </div>
                  <Input
                    value={header.key}
                    onChange={(e) => updateHeader(index, "key", e.target.value)}
                    placeholder="Header-Name"
                    className="bg-[#0a0a0a] border-[#555555] text-[#00ff41] font-mono placeholder:text-[#888888] flex-1"
                  />
                  <div className="text-[#888888]">:</div>
                  <Input
                    value={header.value}
                    onChange={(e) =>
                      updateHeader(index, "value", e.target.value)
                    }
                    placeholder="header-value"
                    className="bg-[#0a0a0a] border-[#555555] text-[#00ff41] font-mono placeholder:text-[#888888] flex-1"
                  />
                  {headers.length > 1 && (
                    <Button
                      onClick={() => removeHeader(index)}
                      size="sm"
                      variant="ghost"
                      className="text-[#ff4444] hover:text-[#ff4444] hover:bg-[#0a0a0a]"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Request Body Section */}
          <Card className="bg-[#111111] border-[#555555]">
            <CardHeader className="pb-3">
              <div className="text-[#00ff41] text-sm font-bold">
                {"> REQUEST_BODY"}
              </div>
            </CardHeader>
            <CardContent>
              <Editor
                value={requestBody}
                onValueChange={(code) => setRequestBody(code)}
                highlight={highlightWithPrism}
                padding={10}
                className="bg-[#0a0a0a] text-[#00ff41] font-mono text-sm rounded-md overflow-auto min-h-32"
                style={{
                  fontFamily: "monospace",
                  fontSize: 14,
                  border: "1px solid #555",
                }}
              />
            </CardContent>
          </Card>

          {/* Response Section */}
          <Card className="bg-[#111111] border-[#555555]">
            <CardHeader className="pb-3">
              <div className="text-[#00ff41] text-sm font-bold">
                {"> RESPONSE_OUTPUT"}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="bg-[#0a0a0a] border-[#555555]">
                  <TabsTrigger
                    value="response"
                    className="font-mono text-xs data-[state=active]:bg-[#00ff41] data-[state=active]:text-[#0a0a0a] text-[#888888]"
                  >
                    BODY
                  </TabsTrigger>
                  <TabsTrigger
                    value="headers"
                    className="font-mono text-xs data-[state=active]:bg-[#00ff41] data-[state=active]:text-[#0a0a0a] text-[#888888]"
                  >
                    HEADERS
                  </TabsTrigger>
                  <TabsTrigger
                    value="status"
                    className="font-mono text-xs data-[state=active]:bg-[#00ff41] data-[state=active]:text-[#0a0a0a] text-[#888888]"
                  >
                    STATUS
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="response" className="mt-4">
                  <div className="bg-[#0a0a0a] border border-[#555555] rounded p-4 min-h-48 max-h-[500px] overflow-y-auto whitespace-pre-wrap custom-scrollbar">
                    {isLoading ? (
                      <div className="text-[#00ff41] font-mono text-sm flex items-center">
                        <Loader2 className="animate-spin mr-2" />
                        Executing request...
                      </div>
                    ) : apiResponse.parsedBody ? (
                      <JsonHighlighter data={apiResponse.parsedBody} />
                    ) : apiResponse.body ? (
                      <pre className="text-white font-mono text-sm">
                        {apiResponse.body}
                      </pre>
                    ) : apiResponse.error ? (
                      <div className="text-[#ff4444] font-mono text-sm">{`Error: ${apiResponse.error}`}</div>
                    ) : (
                      <div className="text-[#888888] text-sm">
                        {"> Waiting for request execution..."}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="headers" className="mt-4">
                  <pre className="bg-[#0a0a0a] border border-[#555555] rounded p-4 min-h-48 whitespace-pre-wrap overflow-x-auto">
                    {isLoading ? (
                      <div className="text-[#00ff41] font-mono text-sm flex items-center">
                        <Loader2 className="animate-spin mr-2" />
                        Executing request...
                      </div>
                    ) : apiResponse.headers ? (
                      Object.entries(apiResponse.headers).map(
                        ([key, value], index) => (
                          <div key={index} className="flex gap-2">
                            <span className="text-[#66d9ff]">{key}:</span>
                            <span className="text-[#ffff00]">{value}</span>
                          </div>
                        )
                      )
                    ) : apiResponse.error ? (
                      <div className="text-[#ff4444] font-mono text-sm">{`Error: ${apiResponse.error}`}</div>
                    ) : (
                      <div className="text-[#888888] text-sm">
                        {"> Waiting for request execution..."}
                      </div>
                    )}
                  </pre>
                </TabsContent>

                <TabsContent value="status" className="mt-4">
                  <div className="bg-[#0a0a0a] border border-[#555555] rounded p-4 min-h-48">
                    {isLoading ? (
                      <div className="text-[#00ff41] font-mono text-sm flex items-center">
                        <Loader2 className="animate-spin mr-2" />
                        Executing request...
                      </div>
                    ) : apiResponse.status ? (
                      <div className="text-[#00ff41] font-mono text-sm">
                        <div className="mb-2">
                          Status:{" "}
                          <span
                            className={`${
                              apiResponse.status >= 400
                                ? "text-[#ff4444]"
                                : "text-[#00ff41]"
                            }`}
                          >
                            {apiResponse.status}
                          </span>{" "}
                          <span className="text-[#888888]">
                            ({apiResponse.statusText})
                          </span>
                        </div>
                        <div className="text-[#888888] text-sm">
                          {"> Request successfully executed."}
                        </div>
                      </div>
                    ) : apiResponse.error ? (
                      <div className="text-[#ff4444] font-mono text-sm">
                        <div className="mb-2">{`Error: ${apiResponse.error}`}</div>
                        <div className="text-[#888888] text-sm">
                          {"> Failed to execute request."}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[#888888] text-sm">
                        {"> Waiting for request execution..."}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Terminal Footer */}
          <div className="text-[#888888] text-xs text-center pt-4 border-t border-[#555555]">
            {"Terminal API Requester v1.0.0 | Ready for commands"}
          </div>
        </div>
      </div>
    </div>
  );
}
