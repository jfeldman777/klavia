"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyId, KeyMapping, LayerSlot } from "@/lib/layout-data";
import {
  ALL_KEYS,
  layerCodeMap,
  layerKeyId,
  layoutToCodeMap,
  typedChar,
} from "@/lib/layout-data";
import {
  isRtlMode,
  type InputModeId,
} from "@/lib/input-modes";
import { MiniKeyboard } from "./mini-keyboard";

type Props = {
  layout: Record<KeyId, KeyMapping>;
  layer: LayerSlot[];
  mode: InputModeId;
  onPress: (id: KeyId | null) => void;
  layerOpen: boolean;
  onLayerOpenChange: (open: boolean) => void;
};

const SAMPLE_RU =
  "Щука, подъём: пиши через Q → цифру. Пример: рыба (V), мир, перо, книга.";
const SAMPLE_HE = "שלום עולם";
const SAMPLE_STD_RU = "Съешь же ещё этих мягких французских булок, да выпей чаю.";
const SAMPLE_STD_EN = "The quick brown fox jumps over the lazy dog.";
const SAMPLE_STD_HE = "שלום עולם — מקלדת עברית רגילה.";

function testerCopy(mode: InputModeId) {
  switch (mode) {
    case "std-ru":
      return {
        hint: "Стандарт ЙЦУКЕН. Pause — следующий режим.",
        sample: SAMPLE_STD_RU,
        placeholder: "Печатайте стандартным русским…",
        lang: "ru" as const,
      };
    case "std-en":
      return {
        hint: "Стандарт QWERTY. Pause — следующий режим.",
        sample: SAMPLE_STD_EN,
        placeholder: "Type in English…",
        lang: "en" as const,
      };
    case "std-he":
      return {
        hint: "Стандартная ивритская клавиатура Windows. Pause — следующий режим.",
        sample: SAMPLE_STD_HE,
        placeholder: "הקלידו במקלדת רגילה…",
        lang: "he" as const,
      };
    case "k-he":
      return {
        hint: "ИВРИТ-КЛАВИА, справа налево. J затем K M N F C — концевые ך ם ן ף ץ.",
        sample: SAMPLE_HE,
        placeholder: "הקלידו כאן…",
        lang: "he" as const,
      };
    default:
      return {
        hint: "РУ-КЛАВИА (Совпад). Q → цифра 2–0. Б — клавиша V.",
        sample: SAMPLE_RU,
        placeholder: "Начните печатать… Q → миника",
        lang: "ru" as const,
      };
  }
}

export function TypingTester({
  layout,
  layer,
  mode,
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
  const modeRef = useRef(mode);

  layoutRef.current = layout;
  layerRef.current = layer;
  layerOpenRef.current = layerOpen;
  onPressRef.current = onPress;
  onLayerOpenChangeRef.current = onLayerOpenChange;
  modeRef.current = mode;

  const insert = (ch: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    el.focus();
    el.setRangeText(ch, start, end, "end");
    setValue(el.value);
  };

  useEffect(() => {
    const stealOsLetter = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return false;
      return (
        e.code.startsWith("Key") ||
        e.code === "Semicolon" ||
        e.code === "Quote" ||
        e.code === "Comma" ||
        e.code === "Period" ||
        e.code === "Slash" ||
        e.code === "BracketLeft" ||
        e.code === "BracketRight"
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!active) return;
      const el = ref.current;
      if (!el || document.activeElement !== el) return;

      const layerEnabled = layerRef.current.length > 0;
      const layerId = layerEnabled
        ? layerKeyId(layoutRef.current)
        : null;

      if (e.code === "Pause") return;

      if (e.code === "Escape") {
        if (layerOpenRef.current) {
          e.preventDefault();
          e.stopPropagation();
          onLayerOpenChangeRef.current(false);
        }
        return;
      }

      if (layerEnabled && layerOpenRef.current) {
        const mini = layerCodeMap(layerRef.current);
        if (e.code in mini) {
          e.preventDefault();
          e.stopPropagation();
          insert(typedChar(mini[e.code], e.shiftKey));
          onLayerOpenChangeRef.current(false);
          onPressRef.current(layerId);
          return;
        }
        const codeMap = layoutToCodeMap(layoutRef.current);
        if (e.code in codeMap) {
          e.preventDefault();
          e.stopPropagation();
          const letter = codeMap[e.code as KeyId];
          if (letter) insert(typedChar(letter, e.shiftKey));
          onLayerOpenChangeRef.current(false);
          onPressRef.current(e.code as KeyId);
          return;
        }
        if (stealOsLetter(e)) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      if (layerId && e.code === layerId) {
        e.preventDefault();
        e.stopPropagation();
        onPressRef.current(layerId);
        onLayerOpenChangeRef.current(true);
        return;
      }

      const codeMap = layoutToCodeMap(layoutRef.current);
      if (e.code in codeMap) {
        e.preventDefault();
        e.stopPropagation();
        const letter = codeMap[e.code as KeyId];
        if (!letter) return;
        onPressRef.current(e.code as KeyId);
        insert(typedChar(letter, e.shiftKey));
        return;
      }

      if (stealOsLetter(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onBeforeInput = (e: Event) => {
      if (!active || !isRtlMode(modeRef.current)) return;
      const el = ref.current;
      if (!el || document.activeElement !== el) return;
      const ie = e as InputEvent;
      if (ie.inputType?.startsWith("insert") && ie.data) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onKeyUp = () => onPressRef.current(null);

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("beforeinput", onBeforeInput, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("beforeinput", onBeforeInput, true);
    };
  }, [active]);

  const copy = testerCopy(mode);
  const rtl = isRtlMode(mode);
  const layerLatin =
    ALL_KEYS.find((k) => k.id === layerKeyId(layout))?.latin ?? "Q";

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 p-5 backdrop-blur-sm">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            Проверка набора
          </p>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{copy.hint}</p>
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
      <p
        className={`mb-3 rounded-lg bg-[var(--surface-2)] px-3 py-2 font-[family-name:var(--font-hebrew)] text-sm text-[var(--ink-muted)] ${
          rtl ? "klavia-rtl" : ""
        }`}
        dir={rtl ? "rtl" : "ltr"}
        lang={copy.lang}
      >
        {copy.sample}
      </p>

      <div className="mb-3">
        <MiniKeyboard
          open={layerOpen}
          layer={layer}
          layerKeyLatin={layerLatin}
          layerTitle={mode === "k-he" ? "Концевые формы" : "Миниклавиатура"}
          layerHint={
            mode === "k-he"
              ? "J, затем K M N F C. Esc — закрыть."
              : "Нажмите цифру или кликните букву. Esc — закрыть."
          }
          onClose={() => onLayerOpenChange(false)}
          onPick={(letter) => {
            insert(typedChar(letter, false));
            onLayerOpenChange(false);
            ref.current?.focus();
          }}
        />
      </div>

      <div dir={rtl ? "rtl" : "ltr"} lang={rtl ? "he" : undefined}>
        <textarea
        ref={ref}
        value={value}
        dir={rtl ? "rtl" : "ltr"}
        lang={copy.lang}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => {
          setTimeout(() => {
            if (document.activeElement !== ref.current) {
              setActive(false);
              onPress(null);
            }
          }, 150);
        }}
        rows={4}
        spellCheck={false}
        placeholder={copy.placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onBeforeInput={(e) => {
          if (!rtl) return;
          if (e.inputType.startsWith("insert") && e.data) e.preventDefault();
        }}
        className={`w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 font-[family-name:var(--font-hebrew)] text-lg leading-relaxed text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--ink-faint)] focus:ring-2 ${
          rtl ? "klavia-rtl" : ""
        }`}
      />
      </div>
    </div>
  );
}
