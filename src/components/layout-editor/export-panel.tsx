"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  exportLayoutJson,
  exportLinuxXkbHint,
  type KeyId,
  type KeyMapping,
  type LayerSlot,
} from "@/lib/layout-data";
import { Check, Copy, Download } from "lucide-react";

type Props = {
  layout: Record<KeyId, KeyMapping>;
  layer: LayerSlot[];
};

export function ExportPanel({ layout, layer }: Props) {
  const [tab, setTab] = useState<"json" | "xkb">("json");
  const [copied, setCopied] = useState(false);

  const content =
    tab === "json"
      ? exportLayoutJson(layout, layer)
      : exportLinuxXkbHint(layout, layer);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const blob = new Blob([content], {
      type: tab === "json" ? "application/json" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      tab === "json" ? "sovpad-layout.json" : "sovpad-xkb-symbols.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 p-5 backdrop-blur-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            Экспорт
          </p>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            JSON (с миниклавиатурой Q) или фрагмент xkb.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={tab === "json" ? "default" : "secondary"}
            onClick={() => setTab("json")}
          >
            JSON
          </Button>
          <Button
            size="sm"
            variant={tab === "xkb" ? "default" : "secondary"}
            onClick={() => setTab("xkb")}
          >
            Linux xkb
          </Button>
        </div>
      </div>
      <pre className="max-h-56 overflow-auto rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[var(--ink-muted)]">
        {content}
      </pre>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="secondary" onClick={copy}>
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Скопировано
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Копировать
            </>
          )}
        </Button>
        <Button size="sm" variant="outline" onClick={download}>
          <Download className="h-3.5 w-3.5" /> Скачать
        </Button>
      </div>
    </div>
  );
}
