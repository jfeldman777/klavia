"use client";

import { Button } from "@/components/ui/button";
import {
  CYRILLIC_ALPHABET,
  suggestedForLatin,
  type KeyMapping,
  type KeyMeta,
} from "@/lib/layout-data";
import { cn } from "@/lib/utils";
import { Lock, Unlock } from "lucide-react";

type Props = {
  selected: KeyMeta | null;
  mapping: KeyMapping | null;
  used: Set<string>;
  onAssign: (letter: string | null) => void;
  onToggleLock: () => void;
};

const HINT: Record<string, { label: string; color: string }> = {
  homoglyph: {
    label: "Графическое совпадение",
    color: "text-[var(--match)]",
  },
  semi: {
    label: "Полусовпадение графическое",
    color: "text-[var(--semi)]",
  },
  phonetic: { label: "Звуковое совпадение", color: "text-[var(--sound)]" },
  extra: { label: "Доп. назначение", color: "text-[var(--extra)]" },
};

export function LetterPicker({
  selected,
  mapping,
  used,
  onAssign,
  onToggleLock,
}: Props) {
  if (!selected || !mapping) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)]/50 p-6 text-[var(--ink-muted)]">
        Выберите клавишу на клавиатуре, чтобы назначить русскую букву.
      </div>
    );
  }

  const suggestion = suggestedForLatin(selected.latin);
  const hint = suggestion ? HINT[suggestion.kind] : null;

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 p-5 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            Клавиша {selected.latin}
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            {mapping.cyrillic ?? "—"}
            <span className="ml-2 text-base text-[var(--ink-faint)]">
              ← {selected.latin}
            </span>
          </p>
          {suggestion && hint && (
            <p className={cn("mt-2 text-sm", hint.color)}>
              {hint.label}: {selected.latin} → {suggestion.letter}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {mapping.locked ||
          mapping.kind === "homoglyph" ||
          mapping.kind === "semi" ||
          mapping.kind === "phonetic" ||
          mapping.kind === "extra" ? (
            <Button variant="secondary" size="sm" onClick={onToggleLock}>
              {mapping.locked ? (
                <>
                  <Unlock className="h-3.5 w-3.5" /> Разблокировать
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" /> Заблокировать
                </>
              )}
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAssign(null)}
            disabled={mapping.locked}
          >
            Очистить
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-11">
        {CYRILLIC_ALPHABET.map((letter) => {
          const taken = used.has(letter) && mapping.cyrillic !== letter;
          const active = mapping.cyrillic === letter;
          const matchHint = suggestion?.letter === letter;
          return (
            <button
              key={letter}
              type="button"
              disabled={mapping.locked}
              onClick={() => onAssign(letter)}
              className={cn(
                "flex h-10 items-center justify-center rounded-lg border font-[family-name:var(--font-display)] text-lg transition-colors",
                active &&
                  "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]",
                !active &&
                  matchHint &&
                  suggestion?.kind === "homoglyph" &&
                  "border-[var(--match-line)] bg-[var(--match-bg)] text-[var(--match)]",
                !active &&
                  matchHint &&
                  suggestion?.kind === "semi" &&
                  "border-[var(--semi-line)] bg-[var(--semi-bg)] text-[var(--semi)]",
                !active &&
                  matchHint &&
                  suggestion?.kind === "phonetic" &&
                  "border-[var(--sound-line)] bg-[var(--sound-bg)] text-[var(--sound)]",
                !active &&
                  matchHint &&
                  suggestion?.kind === "extra" &&
                  "border-[var(--extra-line)] bg-[var(--extra-bg)] text-[var(--extra)]",
                !active &&
                  !matchHint &&
                  "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink)] hover:border-[var(--ink-faint)]",
                taken && !active && "opacity-35",
              )}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
