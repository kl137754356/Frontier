"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useA2UIPrototype } from "@/hooks";

export default function HomePage() {
  useA2UIPrototype();

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--foreground)]">
      <section className="mx-auto flex h-[calc(100vh-3rem)] max-w-4xl flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
        <header className="border-b border-[var(--border)] px-5 py-4">
          <h1 className="text-lg font-semibold">A2UI Decision Prototype</h1>
        </header>
        <div className="min-h-0 flex-1">
          <CopilotChat input={{ disclaimer: () => null, className: "pb-5" }} />
        </div>
      </section>
    </main>
  );
}
