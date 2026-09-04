"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyId, KeyMapping } from "@/lib/layout-data";
import { layoutToCodeMap } from "@/lib/layout-data";

type Props = {
  layout: Record<KeyId, KeyMapping>;
  onPress: (id: KeyId | null) => void;
};

const SAMPLE =
  "Орёл вёл кота через мост. Я пишу на своей раскладке: рыба, мир, перо, книга.";

export function TypingTester({ layout, onPress }: Props) {
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const layoutRef = useRef(layout);
  const onPressRef = useRef(onPress);

  layoutRef.current = layout;
  onPressRef.current = onPress;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!active) return;
      const el = ref.current;
      if (!el || document.activeElement !== el) return;

      const codeMap = layoutToCodeMap(layoutRef.current);
      if (e.code in codeMap) {
        e.preventDefault();
        const letter = codeMap[e.code as KeyId];
        if (!letter) return;
        onPressRef.current(e.code as KeyId);
        const ch = e.shiftKey ? letter.toUpperCase() : letter.toLowerCase();
        const start = el.selectionStart;
        const end = el.selectionEnd;
        setValue((prev) => prev.slice(0, start) + ch + prev.slice(end));
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start + ch.length;
        });
      }
    };

    const onKeyUp = () => onPressRef.current(null);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [active]);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 p-5 backdrop-blur-sm">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            Проверка набора
          </p>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Кликни в поле и печатай — физические клавиши переводятся по вашей
            раскладке (системная раскладка может быть EN).
          </p>
        </div>
        <button
          type="button"
          className="text-xs text-[var(--accent)] underline-offset-2 hover:underline"
          onClick={() => {
            setValue("");
            ref.current?.focus();
          }}
        >
          Очистить
        </button>
      </div>
      <p className="mb-3 rounded-lg bg-[var(--surface-2)] px-3 py-2 font-[family-name:var(--font-mono)] text-sm text-[var(--ink-muted)]">
        {SAMPLE}
      </p>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => {
          setActive(false);
          onPress(null);
        }}
        rows={4}
        spellCheck={false}
        placeholder="Начните печатать…"
        className="w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 font-[family-name:var(--font-display)] text-lg leading-relaxed text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--ink-faint)] focus:ring-2"
      />
    </div>
  );
}
