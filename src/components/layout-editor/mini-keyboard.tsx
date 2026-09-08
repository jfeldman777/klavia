"use client";

import { cn } from "@/lib/utils";
import type { LayerSlot } from "@/lib/layout-data";

type Props = {
  open: boolean;
  layer: LayerSlot[];
  onPick: (letter: string) => void;
  onClose: () => void;
  layerKeyLatin?: string;
  layerTitle?: string;
  layerHint?: string;
  /** Редактирование слота (клик ПКМ / долгий — нет, просто select for editor). */
  editable?: boolean;
  selectedShortcut?: string | null;
  onSelectSlot?: (shortcut: string) => void;
};

export function MiniKeyboard({
  open,
  layer,
  onPick,
  onClose,
  layerKeyLatin = "Q",
  layerTitle = "миниклавиатура",
  layerHint = "Нажмите цифру или кликните букву. Esc — закрыть.",
  editable,
  selectedShortcut,
  onSelectSlot,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="animate-rise rounded-2xl border border-[var(--layer-line)] bg-[var(--layer-bg)] p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)] backdrop-blur-md"
      role="dialog"
      aria-label={layerTitle}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--layer)]">
            {layerKeyLatin} · {layerTitle}
          </p>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{layerHint}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--ink-muted)] hover:bg-[var(--surface-2)]"
        >
          Esc
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {layer.map((slot) => (
          <button
            key={slot.shortcut}
            type="button"
            onClick={() => {
              if (editable && onSelectSlot) {
                onSelectSlot(slot.shortcut);
                return;
              }
              onPick(slot.letter);
            }}
            className={cn(
              "flex h-14 flex-col items-center justify-center rounded-xl border transition",
              "border-[var(--layer-line)] bg-[var(--surface)] hover:brightness-125",
              selectedShortcut === slot.shortcut &&
                "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)]",
            )}
          >
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--ink-faint)]">
              {slot.shortcut}
            </span>
            <span className="font-[family-name:var(--font-hebrew)] text-2xl text-[var(--layer)]">
              {slot.letter}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
