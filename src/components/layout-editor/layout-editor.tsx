"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard } from "./keyboard";
import { LetterPicker } from "./letter-picker";
import { TypingTester } from "./typing-tester";
import { ExportPanel } from "./export-panel";
import { Button } from "@/components/ui/button";
import {
  ALL_KEYS,
  DEFAULT_LAYOUT,
  EXTRA_ASSIGNMENTS,
  HOMOGLYPHS,
  PHONETICS,
  SEMI_HOMOGLYPHS,
  STORAGE_KEY,
  cloneLayout,
  duplicateLetters,
  kindForLatinLetter,
  missingLetters,
  usedLetters,
  type KeyId,
  type KeyMapping,
} from "@/lib/layout-data";
import { RotateCcw } from "lucide-react";

export function LayoutEditor() {
  const [layout, setLayout] = useState<Record<KeyId, KeyMapping>>(() =>
    cloneLayout(),
  );
  const [selectedId, setSelectedId] = useState<KeyId | null>("KeyO");
  const [pressedId, setPressedId] = useState<KeyId | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<KeyId, KeyMapping>;
        setLayout(cloneLayout({ ...DEFAULT_LAYOUT, ...parsed }));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, [layout, hydrated]);

  const selected = useMemo(
    () => ALL_KEYS.find((k) => k.id === selectedId) ?? null,
    [selectedId],
  );

  const used = useMemo(() => usedLetters(layout), [layout]);
  const missing = useMemo(() => missingLetters(layout), [layout]);
  const duplicates = useMemo(() => duplicateLetters(layout), [layout]);
  const conflictIds = useMemo(() => {
    const set = new Set<KeyId>();
    for (const keys of duplicates.values()) {
      for (const id of keys) set.add(id);
    }
    return set;
  }, [duplicates]);

  const counts = useMemo(() => {
    const c = { homoglyph: 0, semi: 0, phonetic: 0, extra: 0, custom: 0 };
    for (const key of ALL_KEYS) {
      const kind = layout[key.id]?.kind;
      if (
        kind === "homoglyph" ||
        kind === "semi" ||
        kind === "phonetic" ||
        kind === "extra" ||
        kind === "custom"
      ) {
        if (layout[key.id]?.cyrillic) c[kind] += 1;
      }
    }
    return c;
  }, [layout]);

  const assign = useCallback(
    (letter: string | null) => {
      if (!selectedId) return;
      setLayout((prev) => {
        const current = prev[selectedId];
        if (current.locked) return prev;
        const latin = ALL_KEYS.find((k) => k.id === selectedId)?.latin ?? "";
        return {
          ...prev,
          [selectedId]: {
            ...current,
            cyrillic: letter ? letter.toUpperCase() : null,
            kind: letter ? kindForLatinLetter(latin, letter) : "empty",
          },
        };
      });
    },
    [selectedId],
  );

  const toggleLock = useCallback(() => {
    if (!selectedId) return;
    setLayout((prev) => ({
      ...prev,
      [selectedId]: {
        ...prev[selectedId],
        locked: !prev[selectedId].locked,
      },
    }));
  }, [selectedId]);

  const reset = () => {
    setLayout(cloneLayout());
    setSelectedId("KeyO");
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3 text-sm">
          <LegendDot
            color="var(--match)"
            label={`Графика · ${counts.homoglyph}`}
          />
          <LegendDot
            color="var(--semi)"
            label={`Полусовпад. · ${counts.semi}`}
          />
          <LegendDot
            color="var(--sound)"
            label={`Звук · ${counts.phonetic}`}
          />
          <LegendDot
            color="var(--extra)"
            label={`Доп. · ${counts.extra}`}
          />
          <LegendDot
            color="var(--custom)"
            label={`Отдельно · ${counts.custom}`}
          />
        </div>
        <Button variant="secondary" size="sm" onClick={reset}>
          <RotateCcw className="h-3.5 w-3.5" /> Сбросить к Совпад
        </Button>
      </div>

      <Keyboard
        layout={layout}
        selectedId={selectedId}
        pressedId={pressedId}
        conflicts={conflictIds}
        onSelect={setSelectedId}
      />

      {(missing.length > 0 || duplicates.size > 0) && (
        <div className="flex flex-wrap gap-3 text-sm">
          {missing.length > 0 && (
            <p className="rounded-full border border-[var(--warn-line)] bg-[var(--warn-bg)] px-3 py-1 text-[var(--warn)]">
              Нет на раскладке: {missing.join(" ")}
            </p>
          )}
          {duplicates.size > 0 && (
            <p className="rounded-full border border-[var(--warn-line)] bg-[var(--warn-bg)] px-3 py-1 text-[var(--warn)]">
              Дубли: {[...duplicates.keys()].join(" ")}
            </p>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <LetterPicker
          selected={selected}
          mapping={selectedId ? layout[selectedId] : null}
          used={used}
          onAssign={assign}
          onToggleLock={toggleLock}
        />
        <TypingTester layout={layout} onPress={setPressedId} />
      </div>

      <ExportPanel layout={layout} />

      <PairTables />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[var(--ink-muted)]">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function PairChip({
  lat,
  cyr,
  tone,
}: {
  lat: string;
  cyr: string;
  tone: "match" | "semi" | "sound" | "extra";
}) {
  const styles = {
    match:
      "border-[var(--match-line)] bg-[var(--match-bg)] text-[var(--match)]",
    semi: "border-[var(--semi-line)] bg-[var(--semi-bg)] text-[var(--semi)]",
    sound:
      "border-[var(--sound-line)] bg-[var(--sound-bg)] text-[var(--sound)]",
    extra:
      "border-[var(--extra-line)] bg-[var(--extra-bg)] text-[var(--extra)]",
  }[tone];

  return (
    <li
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 font-[family-name:var(--font-mono)] text-sm ${styles}`}
    >
      <span className="text-[var(--ink-faint)]">{lat}</span>
      <span aria-hidden>→</span>
      <span className="font-[family-name:var(--font-display)] text-lg">{cyr}</span>
    </li>
  );
}

function PairTables() {
  return (
    <section id="pairs" className="scroll-mt-8 space-y-10 border-t border-[var(--line)] pt-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Графические совпадения
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-muted)]">
          Буквы выглядят почти одинаково — стоят на одной физической клавише.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {Object.entries(HOMOGLYPHS).map(([lat, cyr]) => (
            <PairChip key={lat} lat={lat} cyr={cyr} tone="match" />
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Полусовпадения графические
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-muted)]">
          Силуэт похож, но не тождественен: Я на R, И на N.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {Object.entries(SEMI_HOMOGLYPHS).map(([lat, cyr]) => (
            <PairChip key={lat} lat={lat} cyr={cyr} tone="semi" />
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Совпадения звуковые
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-muted)]">
          Похожий звук — на той же клавише, что и в английской.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {Object.entries(PHONETICS).map(([lat, cyr]) => (
            <PairChip key={lat} lat={lat} cyr={cyr} tone="sound" />
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Дополнительные назначения
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-muted)]">
          Зафиксированы в схеме: Й на I, Ч на S.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {Object.entries(EXTRA_ASSIGNMENTS).map(([lat, cyr]) => (
            <PairChip key={lat} lat={lat} cyr={cyr} tone="extra" />
          ))}
        </ul>
      </div>
    </section>
  );
}
