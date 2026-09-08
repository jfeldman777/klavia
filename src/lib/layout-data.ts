/** Физическая QWERTY-клавиша → русская буква. */

export type KeyId =
  | "KeyQ"
  | "KeyW"
  | "KeyE"
  | "KeyR"
  | "KeyT"
  | "KeyY"
  | "KeyU"
  | "KeyI"
  | "KeyO"
  | "KeyP"
  | "BracketLeft"
  | "BracketRight"
  | "KeyA"
  | "KeyS"
  | "KeyD"
  | "KeyF"
  | "KeyG"
  | "KeyH"
  | "KeyJ"
  | "KeyK"
  | "KeyL"
  | "Semicolon"
  | "Quote"
  | "KeyZ"
  | "KeyX"
  | "KeyC"
  | "KeyV"
  | "KeyB"
  | "KeyN"
  | "KeyM"
  | "Comma"
  | "Period"
  | "Slash";

export type KeyMeta = {
  id: KeyId;
  /** Латинская метка на клавише (как на английской раскладке). */
  latin: string;
  row: 0 | 1 | 2;
  width?: number;
};

export type MappingKind =
  | "homoglyph"
  | "semi"
  | "phonetic"
  | "extra"
  | "layer"
  | "custom"
  | "empty";

export type KeyMapping = {
  cyrillic: string | null;
  kind: MappingKind;
  locked?: boolean;
};

export type ScriptId = "ru" | "he";

/** Клавиша, которая открывает миниклавиатуру оставшихся букв (русская схема). */
export const LAYER_KEY_ID: KeyId = "KeyQ";

/** Концевые иврита: сначала J, потом буква. */
export const HEBREW_LAYER_KEY_ID: KeyId = "KeyJ";

export function isHebrewChar(ch: string): boolean {
  const code = ch.codePointAt(0);
  return code !== undefined && code >= 0x0590 && code <= 0x05ff;
}

/** Русские буквы меняют регистр, иврит — нет. */
export function typedChar(letter: string, shift: boolean): string {
  if (isHebrewChar(letter)) return letter;
  return shift ? letter.toUpperCase() : letter.toLowerCase();
}

export type LayerSlot = {
  /** Подпись на миниклавише (цифра). */
  shortcut: string;
  /** KeyboardEvent.code для второго нажатия. */
  code: string;
  letter: string;
};

/**
 * Оставшиеся буквы без своего места на основной раскладке.
 * Набор: Q → миника → цифра/клик.
 */
export const DEFAULT_LAYER: LayerSlot[] = [
  { shortcut: "2", code: "Digit2", letter: "П" },
  { shortcut: "3", code: "Digit3", letter: "Ш" },
  { shortcut: "4", code: "Digit4", letter: "Щ" },
  { shortcut: "5", code: "Digit5", letter: "Ц" },
  { shortcut: "6", code: "Digit6", letter: "Ъ" },
  { shortcut: "7", code: "Digit7", letter: "Ы" },
  { shortcut: "8", code: "Digit8", letter: "Ь" },
  { shortcut: "9", code: "Digit9", letter: "Э" },
  { shortcut: "0", code: "Digit0", letter: "Ё" },
];

/** Концевые формы: J, затем каф / мем / нун / фей / цади. */
export const HEBREW_LAYER: LayerSlot[] = [
  { shortcut: "K", code: "KeyK", letter: "ך" },
  { shortcut: "M", code: "KeyM", letter: "ם" },
  { shortcut: "N", code: "KeyN", letter: "ן" },
  { shortcut: "F", code: "KeyF", letter: "ף" },
  { shortcut: "C", code: "KeyC", letter: "ץ" },
];

/** Полные графические совпадения: буква выглядит почти одинаково. */
export const HOMOGLYPHS: Record<string, string> = {
  A: "А",
  B: "В",
  C: "С",
  E: "Е",
  H: "Н",
  K: "К",
  M: "М",
  O: "О",
  P: "Р",
  T: "Т",
  X: "Х",
  Y: "У",
};

/** Полусовпадения по силуэту (похожи, но не тождественны). */
export const SEMI_HOMOGLYPHS: Record<string, string> = {
  R: "Я",
  N: "И",
};

/** Звуковые совпадения: похожий звук на той же клавише. */
export const PHONETICS: Record<string, string> = {
  G: "Г",
  D: "Д",
  J: "Ж",
  Z: "З",
  L: "Л",
  U: "Ю",
  F: "Ф",
};

/**
 * Дополнительные назначения (Й←I, Ч←S и т.п.) —
 * не графика и не классический звук, но зафиксированы в схеме.
 */
export const EXTRA_ASSIGNMENTS: Record<string, string> = {
  I: "Й",
  S: "Ч",
  V: "Б",
};

/** Иврит: звук через те же клавиши, что и русская «Совпад». */
export const HEBREW_PHONETICS: Record<string, string> = {
  A: "א",
  B: "ב",
  G: "ג",
  D: "ד",
  E: "ה",
  W: "ו",
  Z: "ז",
  X: "ח",
  T: "ט",
  I: "י",
  K: "כ",
  L: "ל",
  M: "מ",
  N: "נ",
  F: "פ",
  C: "צ",
  Q: "ק",
  P: "ר",
};

/** Визуально: самех похож на O. */
export const HEBREW_HOMOGLYPHS: Record<string, string> = {
  O: "ס",
};

/** Остальные назначения иврита. */
export const HEBREW_EXTRA: Record<string, string> = {
  Y: "ע",
  S: "ש",
  V: "ת",
};

export const CYRILLIC_ALPHABET = [
  "А",
  "Б",
  "В",
  "Г",
  "Д",
  "Е",
  "Ё",
  "Ж",
  "З",
  "И",
  "Й",
  "К",
  "Л",
  "М",
  "Н",
  "О",
  "П",
  "Р",
  "С",
  "Т",
  "У",
  "Ф",
  "Х",
  "Ц",
  "Ч",
  "Ш",
  "Щ",
  "Ъ",
  "Ы",
  "Ь",
  "Э",
  "Ю",
  "Я",
] as const;

/** 22 буквы + 5 концевых. */
export const HEBREW_ALPHABET = [
  "א",
  "ב",
  "ג",
  "ד",
  "ה",
  "ו",
  "ז",
  "ח",
  "ט",
  "י",
  "כ",
  "ל",
  "מ",
  "נ",
  "ס",
  "ע",
  "פ",
  "צ",
  "ק",
  "ר",
  "ש",
  "ת",
  "ך",
  "ם",
  "ן",
  "ף",
  "ץ",
] as const;

export const KEYBOARD_ROWS: KeyMeta[][] = [
  [
    { id: "KeyQ", latin: "Q", row: 0 },
    { id: "KeyW", latin: "W", row: 0 },
    { id: "KeyE", latin: "E", row: 0 },
    { id: "KeyR", latin: "R", row: 0 },
    { id: "KeyT", latin: "T", row: 0 },
    { id: "KeyY", latin: "Y", row: 0 },
    { id: "KeyU", latin: "U", row: 0 },
    { id: "KeyI", latin: "I", row: 0 },
    { id: "KeyO", latin: "O", row: 0 },
    { id: "KeyP", latin: "P", row: 0 },
    { id: "BracketLeft", latin: "[", row: 0 },
    { id: "BracketRight", latin: "]", row: 0 },
  ],
  [
    { id: "KeyA", latin: "A", row: 1 },
    { id: "KeyS", latin: "S", row: 1 },
    { id: "KeyD", latin: "D", row: 1 },
    { id: "KeyF", latin: "F", row: 1 },
    { id: "KeyG", latin: "G", row: 1 },
    { id: "KeyH", latin: "H", row: 1 },
    { id: "KeyJ", latin: "J", row: 1 },
    { id: "KeyK", latin: "K", row: 1 },
    { id: "KeyL", latin: "L", row: 1 },
    { id: "Semicolon", latin: ";", row: 1 },
    { id: "Quote", latin: "'", row: 1 },
  ],
  [
    { id: "KeyZ", latin: "Z", row: 2 },
    { id: "KeyX", latin: "X", row: 2 },
    { id: "KeyC", latin: "C", row: 2 },
    { id: "KeyV", latin: "V", row: 2 },
    { id: "KeyB", latin: "B", row: 2 },
    { id: "KeyN", latin: "N", row: 2 },
    { id: "KeyM", latin: "M", row: 2 },
    { id: "Comma", latin: ",", row: 2 },
    { id: "Period", latin: ".", row: 2 },
    { id: "Slash", latin: "/", row: 2 },
  ],
];

export const ALL_KEYS: KeyMeta[] = KEYBOARD_ROWS.flat();

/**
 * Стартовая раскладка «Совпад»:
 * — графические совпадения;
 * — полусовпадения (Я←R, И←N);
 * — звуковые (Г←G, Д←D, Ж←J, З←Z, Л←L, Ю←U);
 * — остальное задано отдельно.
 */
export const DEFAULT_LAYOUT: Record<KeyId, KeyMapping> = {
  // Графические
  KeyA: { cyrillic: "А", kind: "homoglyph", locked: true },
  KeyB: { cyrillic: "В", kind: "homoglyph", locked: true },
  KeyC: { cyrillic: "С", kind: "homoglyph", locked: true },
  KeyE: { cyrillic: "Е", kind: "homoglyph", locked: true },
  KeyH: { cyrillic: "Н", kind: "homoglyph", locked: true },
  KeyK: { cyrillic: "К", kind: "homoglyph", locked: true },
  KeyM: { cyrillic: "М", kind: "homoglyph", locked: true },
  KeyO: { cyrillic: "О", kind: "homoglyph", locked: true },
  KeyP: { cyrillic: "Р", kind: "homoglyph", locked: true },
  KeyT: { cyrillic: "Т", kind: "homoglyph", locked: true },
  KeyX: { cyrillic: "Х", kind: "homoglyph", locked: true },
  KeyY: { cyrillic: "У", kind: "homoglyph", locked: true },

  // Полусовпадения
  KeyR: { cyrillic: "Я", kind: "semi", locked: true },
  KeyN: { cyrillic: "И", kind: "semi", locked: true },

  // Звуковые
  KeyG: { cyrillic: "Г", kind: "phonetic", locked: true },
  KeyD: { cyrillic: "Д", kind: "phonetic", locked: true },
  KeyJ: { cyrillic: "Ж", kind: "phonetic", locked: true },
  KeyZ: { cyrillic: "З", kind: "phonetic", locked: true },
  KeyL: { cyrillic: "Л", kind: "phonetic", locked: true },
  KeyU: { cyrillic: "Ю", kind: "phonetic", locked: true },
  KeyF: { cyrillic: "Ф", kind: "phonetic", locked: true },

  // Доп. назначения (B занята графическим В, поэтому Б на V)
  KeyI: { cyrillic: "Й", kind: "extra", locked: true },
  KeyS: { cyrillic: "Ч", kind: "extra", locked: true },
  KeyV: { cyrillic: "Б", kind: "extra", locked: true },

  // Портал миниклавиатуры для оставшихся букв
  KeyQ: { cyrillic: null, kind: "layer", locked: true },

  // Свободные клавиши (буквы — только через Q → миника)
  KeyW: { cyrillic: null, kind: "empty" },
  BracketLeft: { cyrillic: null, kind: "empty" },
  BracketRight: { cyrillic: null, kind: "empty" },
  Semicolon: { cyrillic: null, kind: "empty" },
  Quote: { cyrillic: null, kind: "empty" },
  Comma: { cyrillic: null, kind: "empty" },
  Period: { cyrillic: null, kind: "empty" },
  Slash: { cyrillic: null, kind: "empty" },
};

/**
 * Иврит: те же физические клавиши, что у «Совпад».
 * Концевые — слой J, затем буква (K M N F C).
 */
export const HEBREW_LAYOUT: Record<KeyId, KeyMapping> = {
  KeyA: { cyrillic: "א", kind: "phonetic", locked: true },
  KeyB: { cyrillic: "ב", kind: "phonetic", locked: true },
  KeyG: { cyrillic: "ג", kind: "phonetic", locked: true },
  KeyD: { cyrillic: "ד", kind: "phonetic", locked: true },
  KeyE: { cyrillic: "ה", kind: "phonetic", locked: true },
  KeyW: { cyrillic: "ו", kind: "phonetic", locked: true },
  KeyZ: { cyrillic: "ז", kind: "phonetic", locked: true },
  KeyX: { cyrillic: "ח", kind: "phonetic", locked: true },
  KeyT: { cyrillic: "ט", kind: "phonetic", locked: true },
  KeyI: { cyrillic: "י", kind: "phonetic", locked: true },
  KeyK: { cyrillic: "כ", kind: "phonetic", locked: true },
  KeyL: { cyrillic: "ל", kind: "phonetic", locked: true },
  KeyM: { cyrillic: "מ", kind: "phonetic", locked: true },
  KeyN: { cyrillic: "נ", kind: "phonetic", locked: true },
  KeyO: { cyrillic: "ס", kind: "homoglyph", locked: true },
  KeyY: { cyrillic: "ע", kind: "extra", locked: true },
  KeyF: { cyrillic: "פ", kind: "phonetic", locked: true },
  KeyC: { cyrillic: "צ", kind: "phonetic", locked: true },
  KeyQ: { cyrillic: "ק", kind: "phonetic", locked: true },
  KeyP: { cyrillic: "ר", kind: "phonetic", locked: true },
  KeyS: { cyrillic: "ש", kind: "extra", locked: true },
  KeyV: { cyrillic: "ת", kind: "extra", locked: true },

  KeyJ: { cyrillic: null, kind: "layer", locked: true },

  KeyR: { cyrillic: null, kind: "empty" },
  KeyU: { cyrillic: null, kind: "empty" },
  KeyH: { cyrillic: null, kind: "empty" },
  BracketLeft: { cyrillic: null, kind: "empty" },
  BracketRight: { cyrillic: null, kind: "empty" },
  Semicolon: { cyrillic: null, kind: "empty" },
  Quote: { cyrillic: null, kind: "empty" },
  Comma: { cyrillic: null, kind: "empty" },
  Period: { cyrillic: null, kind: "empty" },
  Slash: { cyrillic: null, kind: "empty" },
};

export function layerKeyId(layout: Record<KeyId, KeyMapping>): KeyId {
  for (const key of ALL_KEYS) {
    if (layout[key.id]?.kind === "layer") return key.id;
  }
  return LAYER_KEY_ID;
}

export type ScriptProfile = {
  id: ScriptId;
  label: string;
  defaultLayout: Record<KeyId, KeyMapping>;
  defaultLayer: LayerSlot[];
  alphabet: readonly string[];
  storageKey: string;
  layerStorageKey: string;
  layerHint: string;
};

export const SCRIPT_STORAGE_KEY = "klavia-script-v1";

export const SCRIPTS: Record<ScriptId, ScriptProfile> = {
  ru: {
    id: "ru",
    label: "Совпад",
    defaultLayout: DEFAULT_LAYOUT,
    defaultLayer: DEFAULT_LAYER,
    alphabet: CYRILLIC_ALPHABET,
    storageKey: "sovpad-layout-v5",
    layerStorageKey: "sovpad-layer-v5",
    layerHint: "Q → цифра",
  },
  he: {
    id: "he",
    label: "Иврит",
    defaultLayout: HEBREW_LAYOUT,
    defaultLayer: HEBREW_LAYER,
    alphabet: HEBREW_ALPHABET,
    storageKey: "klavia-he-layout-v1",
    layerStorageKey: "klavia-he-layer-v1",
    layerHint: "J → буква",
  },
};

/** Bump при смене дефолтной схемы, чтобы не тянуть старый localStorage. */
export const STORAGE_KEY = SCRIPTS.ru.storageKey;
export const LAYER_STORAGE_KEY = SCRIPTS.ru.layerStorageKey;

export function cloneLayer(
  layer: LayerSlot[] = DEFAULT_LAYER,
): LayerSlot[] {
  return layer.map((s) => ({ ...s }));
}

export function kindForLatinLetter(
  latin: string,
  cyrillic: string,
  script: ScriptId = "ru",
): MappingKind {
  if (script === "he") {
    if (HEBREW_HOMOGLYPHS[latin] === cyrillic) return "homoglyph";
    if (HEBREW_PHONETICS[latin] === cyrillic) return "phonetic";
    if (HEBREW_EXTRA[latin] === cyrillic) return "extra";
    return "custom";
  }
  const upper = cyrillic.toUpperCase();
  if (HOMOGLYPHS[latin]?.toUpperCase() === upper) return "homoglyph";
  if (SEMI_HOMOGLYPHS[latin]?.toUpperCase() === upper) return "semi";
  if (PHONETICS[latin]?.toUpperCase() === upper) return "phonetic";
  if (EXTRA_ASSIGNMENTS[latin]?.toUpperCase() === upper) return "extra";
  return "custom";
}

export function suggestedForLatin(
  latin: string,
  script: ScriptId = "ru",
): {
  letter: string;
  kind: MappingKind;
} | null {
  if (script === "he") {
    if (HEBREW_HOMOGLYPHS[latin])
      return { letter: HEBREW_HOMOGLYPHS[latin], kind: "homoglyph" };
    if (HEBREW_PHONETICS[latin])
      return { letter: HEBREW_PHONETICS[latin], kind: "phonetic" };
    if (HEBREW_EXTRA[latin])
      return { letter: HEBREW_EXTRA[latin], kind: "extra" };
    return null;
  }
  if (HOMOGLYPHS[latin])
    return { letter: HOMOGLYPHS[latin], kind: "homoglyph" };
  if (SEMI_HOMOGLYPHS[latin])
    return { letter: SEMI_HOMOGLYPHS[latin], kind: "semi" };
  if (PHONETICS[latin]) return { letter: PHONETICS[latin], kind: "phonetic" };
  if (EXTRA_ASSIGNMENTS[latin])
    return { letter: EXTRA_ASSIGNMENTS[latin], kind: "extra" };
  return null;
}

export function cloneLayout(
  layout: Record<KeyId, KeyMapping> = DEFAULT_LAYOUT,
): Record<KeyId, KeyMapping> {
  const next = {} as Record<KeyId, KeyMapping>;
  for (const key of ALL_KEYS) {
    next[key.id] = { ...(layout[key.id] ?? { cyrillic: null, kind: "empty" }) };
  }
  return next;
}

export function usedLetters(
  layout: Record<KeyId, KeyMapping>,
  layer: LayerSlot[] = [],
): Set<string> {
  const set = new Set<string>();
  for (const key of ALL_KEYS) {
    const letter = layout[key.id]?.cyrillic;
    if (letter) set.add(letter.toUpperCase());
  }
  for (const slot of layer) {
    if (slot.letter) set.add(slot.letter.toUpperCase());
  }
  return set;
}

export function missingLetters(
  layout: Record<KeyId, KeyMapping>,
  layer: LayerSlot[] = [],
  alphabet: readonly string[] = CYRILLIC_ALPHABET,
): string[] {
  const used = usedLetters(layout, layer);
  return alphabet.filter((l) => !used.has(l) && !used.has(l.toUpperCase()));
}

export function duplicateLetters(
  layout: Record<KeyId, KeyMapping>,
  layer: LayerSlot[] = [],
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const key of ALL_KEYS) {
    const letter = layout[key.id]?.cyrillic?.toUpperCase();
    if (!letter) continue;
    const list = map.get(letter) ?? [];
    list.push(key.id);
    map.set(letter, list);
  }
  for (const slot of layer) {
    const letter = slot.letter?.toUpperCase();
    if (!letter) continue;
    const list = map.get(letter) ?? [];
    list.push(`layer:${slot.shortcut}`);
    map.set(letter, list);
  }
  for (const [letter, keys] of map) {
    if (keys.length < 2) map.delete(letter);
  }
  return map;
}

export function layoutToCodeMap(
  layout: Record<KeyId, KeyMapping>,
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const key of ALL_KEYS) {
    if (layout[key.id]?.kind === "layer") continue;
    const letter = layout[key.id]?.cyrillic;
    if (letter) map[key.id] = letter;
  }
  return map;
}

export function layerCodeMap(layer: LayerSlot[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const slot of layer) {
    if (slot.letter) map[slot.code] = slot.letter;
  }
  return map;
}

export function exportLayoutJson(
  layout: Record<KeyId, KeyMapping>,
  layer: LayerSlot[] = DEFAULT_LAYER,
): string {
  const layerId = layerKeyId(layout);
  const layerLatin =
    ALL_KEYS.find((k) => k.id === layerId)?.latin ?? "Q";
  const hebrew = ALL_KEYS.some((k) => {
    const letter = layout[k.id]?.cyrillic;
    return letter ? isHebrewChar(letter) : false;
  });
  const rows = KEYBOARD_ROWS.map((row) =>
    row.map((key) => ({
      key: key.latin,
      code: key.id,
      cyrillic: layout[key.id]?.cyrillic,
      kind: layout[key.id]?.kind,
    })),
  );
  return JSON.stringify(
    {
      name: hebrew ? "Иврит" : "Совпад",
      description: hebrew
        ? "Иврит по клавишам Совпад; концевые — J затем буква (K M N F C)."
        : "Графика / полусовпадения / звук / доп.; оставшиеся — через Q → миниклавиатура.",
      version: hebrew ? 1 : 5,
      layerKey: layerLatin,
      layer,
      rows,
    },
    null,
    2,
  );
}

export function exportLinuxXkbHint(
  layout: Record<KeyId, KeyMapping>,
  layer: LayerSlot[] = DEFAULT_LAYER,
): string {
  const lines = [
    "// Фрагмент для xkb (symbols). Минислой Q в xkb обычно делают через level/compose — здесь только прямые клавиши.",
    "partial alphanumeric_keys",
    'xkb_symbols "sovpad" {',
    '    name[Group1]= "Russian (Sovpad)";',
    "",
  ];
  for (const key of ALL_KEYS) {
    if (layout[key.id]?.kind === "layer") continue;
    const letter = layout[key.id]?.cyrillic;
    if (!letter) continue;
    const lower = letter.toLowerCase();
    const upper = letter.toUpperCase();
    lines.push(
      `    key <${xkbKeysym(key.id)}> { [ ${unicodeName(lower)}, ${unicodeName(upper)} ] };`,
    );
  }
  const layerId = layerKeyId(layout);
  const layerLatin =
    ALL_KEYS.find((k) => k.id === layerId)?.latin ?? "Q";
  lines.push(
    "",
    `    // Минислой (в браузере: ${layerLatin} затем клавиша):`,
    ...layer.map(
      (s) => `    //   ${layerLatin} → ${s.shortcut} → ${s.letter}`,
    ),
  );
  lines.push("};", "");
  return lines.join("\n");
}

function xkbKeysym(id: KeyId): string {
  const map: Partial<Record<KeyId, string>> = {
    KeyQ: "AD01",
    KeyW: "AD02",
    KeyE: "AD03",
    KeyR: "AD04",
    KeyT: "AD05",
    KeyY: "AD06",
    KeyU: "AD07",
    KeyI: "AD08",
    KeyO: "AD09",
    KeyP: "AD10",
    BracketLeft: "AD11",
    BracketRight: "AD12",
    KeyA: "AC01",
    KeyS: "AC02",
    KeyD: "AC03",
    KeyF: "AC04",
    KeyG: "AC05",
    KeyH: "AC06",
    KeyJ: "AC07",
    KeyK: "AC08",
    KeyL: "AC09",
    Semicolon: "AC10",
    Quote: "AC11",
    KeyZ: "AB01",
    KeyX: "AB02",
    KeyC: "AB03",
    KeyV: "AB04",
    KeyB: "AB05",
    KeyN: "AB06",
    KeyM: "AB07",
    Comma: "AB08",
    Period: "AB09",
    Slash: "AB10",
  };
  return map[id] ?? id;
}

function unicodeName(ch: string): string {
  const code = ch.codePointAt(0);
  if (code === undefined) return "VoidSymbol";
  return `U${code.toString(16).toUpperCase().padStart(4, "0")}`;
}
