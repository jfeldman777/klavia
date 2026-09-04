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
  | "custom"
  | "empty";

export type KeyMapping = {
  cyrillic: string | null;
  kind: MappingKind;
  locked?: boolean;
};

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

  // Остальные — отдельно
  KeyQ: { cyrillic: "Й", kind: "custom" },
  KeyW: { cyrillic: "Ш", kind: "custom" },
  KeyI: { cyrillic: "П", kind: "custom" },
  BracketLeft: { cyrillic: "Ъ", kind: "custom" },
  BracketRight: { cyrillic: "Ё", kind: "custom" },
  KeyS: { cyrillic: "Ы", kind: "custom" },
  KeyF: { cyrillic: "Ф", kind: "custom" },
  Semicolon: { cyrillic: "Э", kind: "custom" },
  Quote: { cyrillic: "Ь", kind: "custom" },
  KeyV: { cyrillic: "Б", kind: "custom" },
  Comma: { cyrillic: "Ц", kind: "custom" },
  Period: { cyrillic: "Ч", kind: "custom" },
  Slash: { cyrillic: "Щ", kind: "custom" },
};

/** Bump при смене дефолтной схемы, чтобы не тянуть старый localStorage. */
export const STORAGE_KEY = "sovpad-layout-v2";

export function kindForLatinLetter(
  latin: string,
  cyrillic: string,
): MappingKind {
  const upper = cyrillic.toUpperCase();
  if (HOMOGLYPHS[latin]?.toUpperCase() === upper) return "homoglyph";
  if (SEMI_HOMOGLYPHS[latin]?.toUpperCase() === upper) return "semi";
  if (PHONETICS[latin]?.toUpperCase() === upper) return "phonetic";
  return "custom";
}

export function suggestedForLatin(latin: string): {
  letter: string;
  kind: MappingKind;
} | null {
  if (HOMOGLYPHS[latin])
    return { letter: HOMOGLYPHS[latin], kind: "homoglyph" };
  if (SEMI_HOMOGLYPHS[latin])
    return { letter: SEMI_HOMOGLYPHS[latin], kind: "semi" };
  if (PHONETICS[latin]) return { letter: PHONETICS[latin], kind: "phonetic" };
  return null;
}

export function cloneLayout(
  layout: Record<KeyId, KeyMapping> = DEFAULT_LAYOUT,
): Record<KeyId, KeyMapping> {
  const next = {} as Record<KeyId, KeyMapping>;
  for (const key of ALL_KEYS) {
    next[key.id] = { ...layout[key.id] };
  }
  return next;
}

export function usedLetters(layout: Record<KeyId, KeyMapping>): Set<string> {
  const set = new Set<string>();
  for (const key of ALL_KEYS) {
    const letter = layout[key.id]?.cyrillic;
    if (letter) set.add(letter.toUpperCase());
  }
  return set;
}

export function missingLetters(layout: Record<KeyId, KeyMapping>): string[] {
  const used = usedLetters(layout);
  return CYRILLIC_ALPHABET.filter((l) => !used.has(l));
}

export function duplicateLetters(
  layout: Record<KeyId, KeyMapping>,
): Map<string, KeyId[]> {
  const map = new Map<string, KeyId[]>();
  for (const key of ALL_KEYS) {
    const letter = layout[key.id]?.cyrillic?.toUpperCase();
    if (!letter) continue;
    const list = map.get(letter) ?? [];
    list.push(key.id);
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
    const letter = layout[key.id]?.cyrillic;
    if (letter) map[key.id] = letter;
  }
  return map;
}

export function exportLayoutJson(layout: Record<KeyId, KeyMapping>): string {
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
      name: "Совпад",
      description:
        "Русская раскладка: графические совпадения, полусовпадения (Я←R, И←N) и звуковые (Г←G…).",
      version: 2,
      rows,
    },
    null,
    2,
  );
}

export function exportLinuxXkbHint(layout: Record<KeyId, KeyMapping>): string {
  const lines = [
    "// Фрагмент для xkb (symbols). Подставьте в свой файл раскладки.",
    "partial alphanumeric_keys",
    'xkb_symbols "sovpad" {',
    '    name[Group1]= "Russian (Sovpad)";',
    "",
  ];
  for (const key of ALL_KEYS) {
    const letter = layout[key.id]?.cyrillic;
    if (!letter) continue;
    const lower = letter.toLowerCase();
    const upper = letter.toUpperCase();
    lines.push(
      `    key <${xkbKeysym(key.id)}> { [ ${unicodeName(lower)}, ${unicodeName(upper)} ] };`,
    );
  }
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
