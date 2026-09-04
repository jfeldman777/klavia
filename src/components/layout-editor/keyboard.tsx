"use client";

import { KeyCap } from "./key-cap";
import {
  KEYBOARD_ROWS,
  type KeyId,
  type KeyMapping,
} from "@/lib/layout-data";

type Props = {
  layout: Record<KeyId, KeyMapping>;
  selectedId: KeyId | null;
  pressedId: KeyId | null;
  conflicts: Set<KeyId>;
  onSelect: (id: KeyId) => void;
};

export function Keyboard({
  layout,
  selectedId,
  pressedId,
  conflicts,
  onSelect,
}: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="mx-auto flex min-w-[42rem] flex-col gap-1.5 rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 p-3 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:p-4">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-1.5"
            style={{ paddingLeft: `${rowIndex * 1.1}rem` }}
          >
            {row.map((meta) => (
              <KeyCap
                key={meta.id}
                meta={meta}
                mapping={layout[meta.id]}
                selected={selectedId === meta.id}
                pressed={pressedId === meta.id}
                conflict={conflicts.has(meta.id)}
                onSelect={() => onSelect(meta.id)}
              />
            ))}
          </div>
        ))}
        <div className="mt-1 flex justify-center px-8">
          <div className="flex h-11 w-full max-w-md items-center justify-center rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] text-xs tracking-[0.2em] text-[var(--ink-faint)] uppercase">
            пробел
          </div>
        </div>
      </div>
    </div>
  );
}
