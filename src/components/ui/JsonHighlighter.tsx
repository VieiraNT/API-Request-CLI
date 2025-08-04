"use client";

import React from "react";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface JsonHighlighterProps {
  data: JsonValue;
}

const JsonHighlighter = ({ data }: JsonHighlighterProps) => {
  if (typeof data !== "object" || data === null) {
    return <span className="text-white">{String(data)}</span>;
  }

  const jsonString = JSON.stringify(data, null, 2);
  const lines = jsonString.split("\n");

  return (
    <pre className="text-sm text-[#ffffff]">
      {lines.map((line, index) => {
        const parts = line.split(/(".*?")|(\b\d+(\.\d+)?\b)/g);

        return (
          <div key={index}>
            {parts.map((part, partIndex) => {
              if (!part) return null;

              if (part.startsWith('"') && part.endsWith('"')) {
                if (line.includes(`${part}:`)) {
                  return (
                    <span key={partIndex} className="text-[#66d9ff]">
                      {part}
                    </span>
                  );
                }
                return (
                  <span key={partIndex} className="text-[#ffff00]">
                    {part}
                  </span>
                );
              }
              if (!isNaN(Number(part)) && part.trim() !== "") {
                return (
                  <span key={partIndex} className="text-[#ff4444]">
                    {part}
                  </span>
                );
              }
              if (part === "true" || part === "false") {
                return (
                  <span key={partIndex} className="text-[#66d9ff]">
                    {part}
                  </span>
                );
              }
              if (part === "null") {
                return (
                  <span key={partIndex} className="text-[#888888]">
                    {part}
                  </span>
                );
              }
              return (
                <span key={partIndex} className="text-[#ffffff]">
                  {part}
                </span>
              );
            })}
          </div>
        );
      })}
    </pre>
  );
};

export default JsonHighlighter;
