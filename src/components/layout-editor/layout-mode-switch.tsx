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
      <div
        className="grid grid-cols-5 gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-1"
        role="group"
        aria-label="Раскладка"
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
                "flex h-11 min-w-0 items-center justify-center rounded-lg px-1 text-center text-[10px] font-semibold leading-tight tracking-wide transition sm:text-xs",
                on
                  ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                  : "text-[var(--ink)] hover:bg-[var(--surface-3)]",
              )}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-right text-[10px] text-[var(--ink-faint)]">
        Pause — по кругу
      </p>
    </div>
  );
}
