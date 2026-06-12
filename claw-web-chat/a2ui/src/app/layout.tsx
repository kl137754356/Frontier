"use client";

import "./globals.css";
import "@copilotkit/react-core/v2/styles.css";

import type { ReactNode } from "react";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { decisionCatalog } from "./declarative-generative-ui/renderers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>A2UI Decision Prototype</title>
      </head>
      <body>
        <CopilotKit
          runtimeUrl="/api/copilotkit"
          a2ui={{ catalog: decisionCatalog }}
          useSingleEndpoint={false}
        >
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
