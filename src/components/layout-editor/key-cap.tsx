"use client";

import { cn } from "@/lib/utils";
import { isHebrewChar, type KeyMapping, type KeyMeta } from "@/lib/layout-data";

type Props = {
  meta: KeyMeta;
  mapping: KeyMapping;
  selected?: boolean;
  pressed?: boolean;
  conflict?: boolean;
  onSelect: () => void;
};

const KIND_STYLES: Record<
  string,
  { border: string; bg: string; text: string; dot?: string }
> = {
  homoglyph: {
    border: "border-[var(--match-line)]",
    bg: "bg-[var(--match-bg)]",
    text: "text-[var(--match)]",
    dot: "bg-[var(--match)]",
  },
  semi: {
    border: "border-[var(--semi-line)]",
    bg: "bg-[var(--semi-bg)]",
    text: "text-[var(--semi)]",
    dot: "bg-[var(--semi)]",
  },
  phonetic: {
    border: "border-[var(--sound-line)]",
    bg: "bg-[var(--sound-bg)]",
    text: "text-[var(--sound)]",
    dot: "bg-[var(--sound)]",
  },
  extra: {
    border: "border-[var(--extra-line)]",
    bg: "bg-[var(--extra-bg)]",
    text: "text-[var(--extra)]",
    dot: "bg-[var(--extra)]",
  },
  layer: {
    border: "border-[var(--layer-line)]",
    bg: "bg-[var(--layer-bg)]",
    text: "text-[var(--layer)]",
    dot: "bg-[var(--layer)]",
  },
  custom: {
    border: "border-[var(--custom-line)]",
    bg: "bg-[var(--custom-bg)]",
    text: "text-[var(--custom)]",
  },
  empty: {
    border: "border-[var(--line)]",
    bg: "bg-[var(--surface-2)]",
    text: "text-[var(--ink-faint)]",
  },
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
  const styles = KIND_STYLES[kind] ?? KIND_STYLES.empty;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={
        kind === "layer"
          ? `${meta.latin}: слой`
          : `${meta.latin}: ${letter ?? "пусто"}`
      }
      className={cn(
        "group relative flex h-[3.35rem] min-w-[2.85rem] flex-1 flex-col items-stretch justify-between rounded-[10px] border px-1.5 py-1 text-left transition-all duration-150",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        styles.border,
        styles.bg,
        selected &&
          "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)]",
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
          "text-[1.35rem] leading-none tracking-tight",
          letter && isHebrewChar(letter)
            ? "font-[family-name:var(--font-hebrew)]"
            : "font-[family-name:var(--font-display)]",
          styles.text,
        )}
      >
        {kind === "layer" ? "⋯" : (letter ?? "·")}
      </span>
      {styles.dot && (
        <span
          className={cn(
            "pointer-events-none absolute right-1 top-1 h-1.5 w-1.5 rounded-full opacity-80",
            styles.dot,
          )}
        />
      )}
    </button>
  );
}
