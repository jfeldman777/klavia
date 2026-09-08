"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard } from "./keyboard";
import { LetterPicker } from "./letter-picker";
import { TypingTester } from "./typing-tester";
import { ExportPanel } from "./export-panel";
import { MiniKeyboard } from "./mini-keyboard";
import { InstallPanel } from "./install-panel";
import { Button } from "@/components/ui/button";
import {
  ALL_KEYS,
  EXTRA_ASSIGNMENTS,
  HEBREW_EXTRA,
  HEBREW_HOMOGLYPHS,
  HEBREW_LAYER,
  HEBREW_PHONETICS,
  HOMOGLYPHS,
  PHONETICS,
  SCRIPT_STORAGE_KEY,
  SCRIPTS,
  SEMI_HOMOGLYPHS,
  cloneLayer,
  cloneLayout,
  duplicateLetters,
  kindForLatinLetter,
  layerKeyId,
  missingLetters,
  usedLetters,
  type KeyId,
  type KeyMapping,
  type LayerSlot,
  type ScriptId,
} from "@/lib/layout-data";
import { RotateCcw } from "lucide-react";

function loadScriptState(id: ScriptId): {
  layout: Record<KeyId, KeyMapping>;
  layer: LayerSlot[];
} {
  const profile = SCRIPTS[id];
  let layout = cloneLayout(profile.defaultLayout);
  let layer = cloneLayer(profile.defaultLayer);
  try {
    const raw = localStorage.getItem(profile.storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<KeyId, KeyMapping>;
      layout = cloneLayout({ ...profile.defaultLayout, ...parsed });
    }
    const layerRaw = localStorage.getItem(profile.layerStorageKey);
    if (layerRaw) {
      layer = cloneLayer(JSON.parse(layerRaw) as LayerSlot[]);
    }
  } catch {
    /* ignore */
  }
  return { layout, layer };
}

export function LayoutEditor() {
  const [script, setScript] = useState<ScriptId>("ru");
  const [layout, setLayout] = useState<Record<KeyId, KeyMapping>>(() =>
    cloneLayout(),
  );
  const [layer, setLayer] = useState<LayerSlot[]>(() => cloneLayer());
  const [selectedId, setSelectedId] = useState<KeyId | null>("KeyO");
  const [pressedId, setPressedId] = useState<KeyId | null>(null);
  const [layerOpen, setLayerOpen] = useState(false);
  const [selectedLayerShortcut, setSelectedLayerShortcut] = useState<
    string | null
  >("2");
  const [hydrated, setHydrated] = useState(false);

  const profile = SCRIPTS[script];
  const activeLayerKey = layerKeyId(layout);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SCRIPT_STORAGE_KEY);
      const id: ScriptId = saved === "he" ? "he" : "ru";
      const loaded = loadScriptState(id);
      setScript(id);
      setLayout(loaded.layout);
      setLayer(loaded.layer);
      if (id === "he") {
        setSelectedLayerShortcut(HEBREW_LAYER[0]?.shortcut ?? "K");
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SCRIPT_STORAGE_KEY, script);
  }, [script, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(profile.storageKey, JSON.stringify(layout));
  }, [layout, hydrated, profile.storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(profile.layerStorageKey, JSON.stringify(layer));
  }, [layer, hydrated, profile.layerStorageKey]);

  const selected = useMemo(
    () => ALL_KEYS.find((k) => k.id === selectedId) ?? null,
    [selectedId],
  );

  const used = useMemo(() => usedLetters(layout, layer), [layout, layer]);
  const missing = useMemo(
    () => missingLetters(layout, layer, profile.alphabet),
    [layout, layer, profile.alphabet],
  );
  const duplicates = useMemo(
    () => duplicateLetters(layout, layer),
    [layout, layer],
  );
  const conflictIds = useMemo(() => {
    const set = new Set<KeyId>();
    for (const keys of duplicates.values()) {
      for (const id of keys) {
        if (!id.startsWith("layer:")) set.add(id as KeyId);
      }
    }
    return set;
  }, [duplicates]);

  const counts = useMemo(() => {
    const c = {
      homoglyph: 0,
      semi: 0,
      phonetic: 0,
      extra: 0,
      layer: 0,
      custom: 0,
    };
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
      if (kind === "layer") c.layer = 1;
    }
    return c;
  }, [layout]);

  const assign = useCallback(
    (letter: string | null) => {
      if (!selectedId) return;
      setLayout((prev) => {
        const current = prev[selectedId];
        if (current.locked || current.kind === "layer") return prev;
        const latin = ALL_KEYS.find((k) => k.id === selectedId)?.latin ?? "";
        return {
          ...prev,
          [selectedId]: {
            ...current,
            cyrillic: letter ? letter.toUpperCase() : null,
            kind: letter ? kindForLatinLetter(latin, letter, script) : "empty",
          },
        };
      });
    },
    [selectedId, script],
  );

  const assignLayerLetter = useCallback(
    (letter: string) => {
      if (!selectedLayerShortcut) return;
      setLayer((prev) =>
        prev.map((slot) =>
          slot.shortcut === selectedLayerShortcut
            ? { ...slot, letter: letter.toUpperCase() }
            : slot,
        ),
      );
    },
    [selectedLayerShortcut],
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
    setLayout(cloneLayout(profile.defaultLayout));
    setLayer(cloneLayer(profile.defaultLayer));
    setSelectedId(script === "he" ? "KeyA" : "KeyO");
    setLayerOpen(false);
  };

  const switchScript = (id: ScriptId) => {
    if (id === script) return;
    localStorage.setItem(profile.storageKey, JSON.stringify(layout));
    localStorage.setItem(profile.layerStorageKey, JSON.stringify(layer));
    const loaded = loadScriptState(id);
    setScript(id);
    setLayout(loaded.layout);
    setLayer(loaded.layer);
    setLayerOpen(false);
    setSelectedId(id === "he" ? "KeyA" : "KeyO");
    setSelectedLayerShortcut(
      id === "he" ? (HEBREW_LAYER[0]?.shortcut ?? "K") : "2",
    );
  };

  const handleSelectKey = (id: KeyId) => {
    setSelectedId(id);
    if (id === activeLayerKey) setLayerOpen(true);
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-0.5">
            {(["ru", "he"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => switchScript(id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  script === id
                    ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                {SCRIPTS[id].label}
              </button>
            ))}
          </div>
          <LegendDot
            color="var(--match)"
            label={`Графика · ${counts.homoglyph}`}
          />
          {script === "ru" && (
            <LegendDot
              color="var(--semi)"
              label={`Полусовпад. · ${counts.semi}`}
            />
          )}
          <LegendDot
            color="var(--sound)"
            label={`Звук · ${counts.phonetic}`}
          />
          <LegendDot color="var(--extra)" label={`Доп. · ${counts.extra}`} />
          <LegendDot
            color="var(--layer)"
            label={`${profile.layerHint} · ${layer.length}`}
          />
        </div>
        <Button variant="secondary" size="sm" onClick={reset}>
          <RotateCcw className="h-3.5 w-3.5" /> Сбросить к {profile.label}
        </Button>
      </div>

      <Keyboard
        layout={layout}
        selectedId={selectedId}
        pressedId={pressedId}
        conflicts={conflictIds}
        onSelect={handleSelectKey}
      />

      {selectedId === activeLayerKey && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <MiniKeyboard
            open
            layer={layer}
            layerKeyLatin={
              ALL_KEYS.find((k) => k.id === activeLayerKey)?.latin ?? "Q"
            }
            layerTitle={
              script === "he" ? "Концевые формы" : "Миниклавиатура"
            }
            layerHint={
              script === "he"
                ? "J, затем K M N F C. Esc — закрыть."
                : "Нажмите цифру или кликните букву. Esc — закрыть."
            }
            onClose={() => setSelectedId(script === "he" ? "KeyA" : "KeyO")}
            onPick={() => undefined}
            editable
            selectedShortcut={selectedLayerShortcut}
            onSelectSlot={setSelectedLayerShortcut}
          />
          <LayerLetterEditor
            shortcut={selectedLayerShortcut}
            letter={
              layer.find((s) => s.shortcut === selectedLayerShortcut)?.letter ??
              null
            }
            used={used}
            alphabet={profile.alphabet}
            layerLabel={profile.layerHint}
            onAssign={assignLayerLetter}
          />
        </div>
      )}

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
          alphabet={profile.alphabet}
          script={script}
          layerHint={
            script === "he"
              ? "J не печатает букву — открывает слой концевых: ך ם ן ף ץ. В наборе: J → K M N F C."
              : "Q не печатает букву сама — открывает слой оставшихся: П Ш Щ Ц Ъ Ы Ь Э Ё. В наборе: Q → цифра 2–0. Б на клавише V."
          }
          onAssign={assign}
          onToggleLock={toggleLock}
          onOpenLayer={() => setLayerOpen(true)}
        />
        <TypingTester
          key={script}
          layout={layout}
          layer={layer}
          script={script}
          onPress={setPressedId}
          layerOpen={layerOpen}
          onLayerOpenChange={setLayerOpen}
        />
      </div>

      <InstallPanel layout={layout} layer={layer} />

      <ExportPanel layout={layout} layer={layer} />

      <PairTables script={script} layer={layer} />
    </div>
  );
}

function LayerLetterEditor({
  shortcut,
  letter,
  used,
  alphabet,
  layerLabel,
  onAssign,
}: {
  shortcut: string | null;
  letter: string | null;
  used: Set<string>;
  alphabet: readonly string[];
  layerLabel: string;
  onAssign: (letter: string) => void;
}) {
  if (!shortcut) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] p-5 text-[var(--ink-muted)]">
        Выберите слот на миниклавиатуре.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 p-5">
      <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--ink-faint)]">
        Слот {layerLabel.split(" ")[0]} → {shortcut}
      </p>
      <p className="mt-1 font-[family-name:var(--font-hebrew)] text-3xl text-[var(--layer)]">
        {letter ?? "—"}
      </p>
      <div className="mt-4 grid grid-cols-6 gap-1.5 sm:grid-cols-8">
        {alphabet
          .filter((l) => !used.has(l) || l === letter)
          .map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => onAssign(l)}
            className={`flex h-9 items-center justify-center rounded-lg border font-[family-name:var(--font-hebrew)] text-lg ${
              l === letter
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink)]"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
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
  tone: "match" | "semi" | "sound" | "extra" | "layer";
}) {
  const styles = {
    match:
      "border-[var(--match-line)] bg-[var(--match-bg)] text-[var(--match)]",
    semi: "border-[var(--semi-line)] bg-[var(--semi-bg)] text-[var(--semi)]",
    sound:
      "border-[var(--sound-line)] bg-[var(--sound-bg)] text-[var(--sound)]",
    extra:
      "border-[var(--extra-line)] bg-[var(--extra-bg)] text-[var(--extra)]",
    layer:
      "border-[var(--layer-line)] bg-[var(--layer-bg)] text-[var(--layer)]",
  }[tone];

  return (
    <li
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 font-[family-name:var(--font-mono)] text-sm ${styles}`}
    >
      <span className="text-[var(--ink-faint)]">{lat}</span>
      <span aria-hidden>→</span>
      <span
        className={`text-lg ${
          /[\u0590-\u05FF]/.test(cyr)
            ? "font-[family-name:var(--font-hebrew)]"
            : "font-[family-name:var(--font-display)]"
        }`}
      >
        {cyr}
      </span>
    </li>
  );
}

function PairTables({
  script,
  layer,
}: {
  script: ScriptId;
  layer: LayerSlot[];
}) {
  if (script === "he") {
    return (
      <section
        id="pairs"
        className="scroll-mt-8 space-y-10 border-t border-[var(--line)] pt-8"
      >
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            Звук
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {Object.entries(HEBREW_PHONETICS).map(([lat, he]) => (
              <PairChip key={lat} lat={lat} cyr={he} tone="sound" />
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            Графика
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {Object.entries(HEBREW_HOMOGLYPHS).map(([lat, he]) => (
              <PairChip key={lat} lat={lat} cyr={he} tone="match" />
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            Дополнительно
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {Object.entries(HEBREW_EXTRA).map(([lat, he]) => (
              <PairChip key={lat} lat={lat} cyr={he} tone="extra" />
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            Концевые (J)
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--ink-muted)]">
            Сначала J, потом букву: каф, мем, нун, фей, цади.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {layer.map((slot) => (
              <PairChip
                key={slot.shortcut}
                lat={`J${slot.shortcut}`}
                cyr={slot.letter}
                tone="layer"
              />
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section
      id="pairs"
      className="scroll-mt-8 space-y-10 border-t border-[var(--line)] pt-8"
    >
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Графические совпадения
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {Object.entries(HOMOGLYPHS).map(([lat, cyr]) => (
            <PairChip key={lat} lat={lat} cyr={cyr} tone="match" />
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Полусовпадения
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {Object.entries(SEMI_HOMOGLYPHS).map(([lat, cyr]) => (
            <PairChip key={lat} lat={lat} cyr={cyr} tone="semi" />
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Звук
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {Object.entries(PHONETICS).map(([lat, cyr]) => (
            <PairChip key={lat} lat={lat} cyr={cyr} tone="sound" />
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Дополнительно
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {Object.entries(EXTRA_ASSIGNMENTS).map(([lat, cyr]) => (
            <PairChip key={lat} lat={lat} cyr={cyr} tone="extra" />
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Миниклавиатура (Q)
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-muted)]">
          Оставшиеся буквы: нажмите Q, затем цифру.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {layer.map((slot) => (
            <PairChip
              key={slot.shortcut}
              lat={`Q${slot.shortcut}`}
              cyr={slot.letter}
              tone="layer"
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
