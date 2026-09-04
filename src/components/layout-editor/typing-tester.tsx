"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyId, KeyMapping, LayerSlot } from "@/lib/layout-data";
import {
  LAYER_KEY_ID,
  layerCodeMap,
  layoutToCodeMap,
} from "@/lib/layout-data";
import { MiniKeyboard } from "./mini-keyboard";

type Props = {
  layout: Record<KeyId, KeyMapping>;
  layer: LayerSlot[];
  onPress: (id: KeyId | null) => void;
  layerOpen: boolean;
  onLayerOpenChange: (open: boolean) => void;
};

const SAMPLE =
  "Щука, подъём: пиши через Q → цифру. Пример: рыба, мир, перо, книга.";

export function TypingTester({
  layout,
  layer,
  onPress,
  layerOpen,
  onLayerOpenChange,
}: Props) {
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const layoutRef = useRef(layout);
  const layerRef = useRef(layer);
  const layerOpenRef = useRef(layerOpen);
  const onPressRef = useRef(onPress);
  const onLayerOpenChangeRef = useRef(onLayerOpenChange);

  layoutRef.current = layout;
  layerRef.current = layer;
  layerOpenRef.current = layerOpen;
  onPressRef.current = onPress;
  onLayerOpenChangeRef.current = onLayerOpenChange;

  const insert = (ch: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    setValue((prev) => prev.slice(0, start) + ch + prev.slice(end));
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + ch.length;
      el.focus();
    });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!active) return;
      const el = ref.current;
      if (!el || document.activeElement !== el) return;

      if (e.code === "Escape") {
        if (layerOpenRef.current) {
          e.preventDefault();
          onLayerOpenChangeRef.current(false);
        }
        return;
      }

      if (layerOpenRef.current) {
        const mini = layerCodeMap(layerRef.current);
        if (e.code in mini) {
          e.preventDefault();
          const letter = mini[e.code];
          const ch = e.shiftKey ? letter.toUpperCase() : letter.toLowerCase();
          insert(ch);
          onLayerOpenChangeRef.current(false);
          onPressRef.current(LAYER_KEY_ID);
          return;
        }
        // пока слой открыт — не печатать обычные буквы
        if (e.code.startsWith("Key") || e.code.startsWith("Digit")) {
          e.preventDefault();
        }
        return;
      }

      if (e.code === LAYER_KEY_ID) {
        e.preventDefault();
        onPressRef.current(LAYER_KEY_ID);
        onLayerOpenChangeRef.current(true);
        return;
      }

      const codeMap = layoutToCodeMap(layoutRef.current);
      if (e.code in codeMap) {
        e.preventDefault();
        const letter = codeMap[e.code as KeyId];
        if (!letter) return;
        onPressRef.current(e.code as KeyId);
        const ch = e.shiftKey ? letter.toUpperCase() : letter.toLowerCase();
        insert(ch);
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
            Q открывает миниклавиатуру оставшихся букв, затем цифра 1–0.
          </p>
        </div>
        <button
          type="button"
          className="text-xs text-[var(--accent)] underline-offset-2 hover:underline"
          onClick={() => {
            setValue("");
            onLayerOpenChange(false);
            ref.current?.focus();
          }}
        >
          Очистить
        </button>
      </div>
      <p className="mb-3 rounded-lg bg-[var(--surface-2)] px-3 py-2 font-[family-name:var(--font-mono)] text-sm text-[var(--ink-muted)]">
        {SAMPLE}
      </p>

      <div className="mb-3">
        <MiniKeyboard
          open={layerOpen}
          layer={layer}
          onClose={() => onLayerOpenChange(false)}
          onPick={(letter) => {
            const ch = letter.toLowerCase();
            insert(ch);
            onLayerOpenChange(false);
            ref.current?.focus();
          }}
        />
      </div>

      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => {
          // не закрываем слой сразу — клик по минике успеет сработать
          setTimeout(() => {
            if (document.activeElement !== ref.current) {
              setActive(false);
              onPress(null);
            }
          }, 150);
        }}
        rows={4}
        spellCheck={false}
        placeholder="Начните печатать… Q → миника"
        className="w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 font-[family-name:var(--font-display)] text-lg leading-relaxed text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--ink-faint)] focus:ring-2"
      />
    </div>
  );
}
