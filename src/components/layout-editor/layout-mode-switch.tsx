"use client";

import { INPUT_MODES, type InputModeId } from "@/lib/input-modes";
import { cn } from "@/lib/utils";

type Props = {
  value: InputModeId;
  onChange: (id: InputModeId) => void;
};

export function LayoutModeSwitch({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <p className="mb-2 text-sm text-[var(--ink)]">
        Нажмите, <span className="font-semibold">какой раскладкой печатать</span>
        . Потом пишите в поле «Проверка набора».
      </p>
      <div
        className="grid grid-cols-5 gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-1"
        role="group"
        aria-label="Какой раскладкой печатать"
      >
        {INPUT_MODES.map((mode) => {
          const on = value === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              title={mode.hint}
              onClick={() => onChange(mode.id)}
              className={cn(
                "flex min-h-[4.25rem] min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-center transition sm:min-h-[4.75rem]",
                on
                  ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                  : "text-[var(--ink)] hover:bg-[var(--surface-3)]",
              )}
            >
              <span className="text-[11px] font-semibold leading-tight tracking-wide sm:text-xs">
                {mode.label}
              </span>
              <span
                className={cn(
                  "text-[10px] leading-snug font-normal sm:text-[11px]",
                  on ? "text-[var(--accent-fg)]/80" : "text-[var(--ink-muted)]",
                )}
              >
                {mode.explain}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">
        Клавиша <span className="text-[var(--ink)]">Pause</span> (на ноутбуке{" "}
        <span className="text-[var(--ink)]">Fn + Pause</span>) — следующая по
        кругу.
      </p>
    </div>
  );
}
