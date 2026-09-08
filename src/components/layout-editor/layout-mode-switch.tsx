"use client";

import { INPUT_MODES, type InputModeId } from "@/lib/input-modes";
import { cn } from "@/lib/utils";

type Props = {
  value: InputModeId;
  onChange: (id: InputModeId) => void;
};

export function LayoutModeSwitch({ value, onChange }: Props) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/95 px-3 py-2 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-5 gap-1">
        {INPUT_MODES.map((mode) => {
          const on = value === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              title={mode.hint}
              onClick={() => onChange(mode.id)}
              className={cn(
                "flex h-10 min-w-0 items-center justify-center rounded-lg px-1 text-center text-[10px] font-semibold leading-tight tracking-wide transition sm:h-11 sm:text-xs",
                on
                  ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                  : "bg-[var(--surface-2)] text-[var(--ink)] hover:bg-[var(--surface-3)]",
              )}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
