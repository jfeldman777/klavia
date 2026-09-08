import {
  ALL_KEYS,
  cloneLayout,
  type KeyId,
  type KeyMapping,
} from "./layout-data";

export type InputModeId = "std-ru" | "std-en" | "std-he" | "k-ru" | "k-he";

export const INPUT_MODES: {
  id: InputModeId;
  label: string;
  hint: string;
}[] = [
  { id: "std-ru", label: "РУ", hint: "стандарт ЙЦУКЕН" },
  { id: "std-en", label: "АНГЛ", hint: "стандарт QWERTY" },
  { id: "std-he", label: "ИВРИТ", hint: "стандартная ивритская" },
  { id: "k-ru", label: "РУ-КЛАВИА", hint: "Совпад" },
  { id: "k-he", label: "ИВРИТ-КЛАВИА", hint: "карта Совпад, справа налево" },
];

export const INPUT_MODE_STORAGE_KEY = "klavia-input-mode-v1";

const STD_RU_LETTERS: Partial<Record<KeyId, string>> = {
  KeyQ: "Й",
  KeyW: "Ц",
  KeyE: "У",
  KeyR: "К",
  KeyT: "Е",
  KeyY: "Н",
  KeyU: "Г",
  KeyI: "Ш",
  KeyO: "Щ",
  KeyP: "З",
  BracketLeft: "Х",
  BracketRight: "Ъ",
  KeyA: "Ф",
  KeyS: "Ы",
  KeyD: "В",
  KeyF: "А",
  KeyG: "П",
  KeyH: "Р",
  KeyJ: "О",
  KeyK: "Л",
  KeyL: "Д",
  Semicolon: "Ж",
  Quote: "Э",
  KeyZ: "Я",
  KeyX: "Ч",
  KeyC: "С",
  KeyV: "М",
  KeyB: "И",
  KeyN: "Т",
  KeyM: "Ь",
  Comma: "Б",
  Period: "Ю",
  Slash: ".",
};

/** Стандартный иврит Windows (kbdheb), не карта Klavia. */
const STD_HE_LETTERS: Partial<Record<KeyId, string>> = {
  KeyQ: "/",
  KeyW: "'",
  KeyE: "ק",
  KeyR: "ר",
  KeyT: "א",
  KeyY: "ט",
  KeyU: "ו",
  KeyI: "ן",
  KeyO: "ם",
  KeyP: "פ",
  BracketLeft: "]",
  BracketRight: "[",
  KeyA: "ש",
  KeyS: "ד",
  KeyD: "ג",
  KeyF: "כ",
  KeyG: "ע",
  KeyH: "י",
  KeyJ: "ח",
  KeyK: "ל",
  KeyL: "ך",
  Semicolon: "ף",
  Quote: ",",
  KeyZ: "ז",
  KeyX: "ס",
  KeyC: "ב",
  KeyV: "ה",
  KeyB: "נ",
  KeyN: "מ",
  KeyM: "צ",
  Comma: "ת",
  Period: "ץ",
  Slash: ".",
};

function lettersToLayout(
  letters: Partial<Record<KeyId, string>>,
): Record<KeyId, KeyMapping> {
  const layout = {} as Record<KeyId, KeyMapping>;
  for (const key of ALL_KEYS) {
    const letter = letters[key.id] ?? null;
    layout[key.id] = {
      cyrillic: letter,
      kind: letter ? "custom" : "empty",
      locked: true,
    };
  }
  return layout;
}

const STD_EN_LETTERS: Partial<Record<KeyId, string>> = Object.fromEntries(
  ALL_KEYS.map((key) => [key.id, key.latin]),
) as Partial<Record<KeyId, string>>;

export const STANDARD_LAYOUTS: Record<
  "std-ru" | "std-en" | "std-he",
  Record<KeyId, KeyMapping>
> = {
  "std-ru": lettersToLayout(STD_RU_LETTERS),
  "std-en": lettersToLayout(STD_EN_LETTERS),
  "std-he": lettersToLayout(STD_HE_LETTERS),
};

export function isKlaviaMode(mode: InputModeId): boolean {
  return mode === "k-ru" || mode === "k-he";
}

export function isRtlMode(mode: InputModeId): boolean {
  return mode === "std-he" || mode === "k-he";
}

export function nextInputMode(mode: InputModeId): InputModeId {
  const i = INPUT_MODES.findIndex((m) => m.id === mode);
  const n = i < 0 ? 0 : (i + 1) % INPUT_MODES.length;
  return INPUT_MODES[n].id;
}

export function parseInputMode(raw: string | null): InputModeId | null {
  return INPUT_MODES.some((m) => m.id === raw)
    ? (raw as InputModeId)
    : null;
}

export function displayLayoutFor(
  mode: InputModeId,
  klaviaLayout: Record<KeyId, KeyMapping>,
): Record<KeyId, KeyMapping> {
  if (mode === "k-ru" || mode === "k-he") return klaviaLayout;
  return cloneLayout(STANDARD_LAYOUTS[mode]);
}
