"use client";

import { cn } from "@/lib/utils";
import type { KeyMapping, KeyMeta } from "@/lib/layout-data";

type Props = {
  meta: KeyMeta;
  mapping: KeyMapping;
  selected?: boolean;
  pressed?: boolean;
  conflict?: boolean;
  onSelect: () => void;
};

export function KeyCap({
  meta,
  mapping,
  selected,
  pressed,
  conflict,
  onSelect,
}: Props) {
  const kind = mapping.kind;
  const letter = mapping.cyrillic;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${meta.latin}: ${letter ?? "пусто"}`}
      className={cn(
        "group relative flex h-[3.35rem] min-w-[2.85rem] flex-1 flex-col items-stretch justify-between rounded-[10px] border px-1.5 py-1 text-left transition-all duration-150",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        kind === "homoglyph" &&
          "border-[var(--match-line)] bg-[var(--match-bg)]",
        kind === "custom" && "border-[var(--custom-line)] bg-[var(--custom-bg)]",
        kind === "empty" && "border-[var(--line)] bg-[var(--surface-2)]",
        selected && "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)]",
        pressed && "translate-y-[1px] brightness-125",
        conflict && "outline outline-2 outline-[var(--warn)]",
        mapping.locked && "cursor-default",
      )}
    >
      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--ink-faint)]">
        {meta.latin}
      </span>
      <span
        className={cn(
          "font-[family-name:var(--font-display)] text-[1.35rem] leading-none tracking-tight",
          kind === "homoglyph" && "text-[var(--match)]",
          kind === "custom" && "text-[var(--custom)]",
          kind === "empty" && "text-[var(--ink-faint)]",
        )}
      >
        {letter ?? "·"}
      </span>
      {kind === "homoglyph" && (
        <span className="pointer-events-none absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[var(--match)] opacity-80" />
      )}
    </button>
  );
}
