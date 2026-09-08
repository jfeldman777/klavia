import type { KeyId, KeyMapping, LayerSlot } from "./layout-data";
import {
  ALL_KEYS,
  isHebrewChar,
  layerKeyId,
  typedChar,
} from "./layout-data";

function lower(ch: string): string {
  return ch.toLowerCase();
}

function upper(ch: string): string {
  return ch.toUpperCase();
}

function unicodeU(ch: string): string {
  const code = ch.codePointAt(0);
  if (code === undefined) return "0000";
  return code.toString(16).toUpperCase().padStart(4, "0");
}

/** AutoHotkey v2 — работает на любом Windows без установки раскладки в систему. */
export function exportWindowsAhk(
  layout: Record<KeyId, KeyMapping>,
  layer: LayerSlot[],
): string {
  const layerId = layerKeyId(layout);
  const layerLatin = ALL_KEYS.find((k) => k.id === layerId)?.latin ?? "Q";
  const layerSc = ahkKeyName(layerLatin);
  const hebrew = layoutIsHebrew(layout);
  const title = hebrew ? "Klavia / Иврит" : "Klavia / Совпад";
  const layerHelp = hebrew
    ? `${layerLatin} затем K M N F C — концевые ך ם ן ף ץ`
    : `${layerLatin} затем 2–0 — миниклавиатура оставшихся букв (Б на V)`;

  const lines = [
    `; ${title} — портативная раскладка для Windows (AutoHotkey v2)`,
    "; 1) Установите AutoHotkey v2: https://www.autohotkey.com/",
    "; 2) Запустите этот файл — раскладка активна в любом приложении",
    "; 3) Переключение: Pause (или правый Ctrl+Space) — вкл/выкл",
    `; ${layerHelp}`,
    "#Requires AutoHotkey v2.0",
    "#SingleInstance Force",
    "SendMode \"Input\"",
    "",
    "global KlaviaOn := true",
    "global KlaviaLayer := false",
    "",
    `TrayTip "Klavia", "Раскладка включена. Pause — вкл/выкл."`,
    "",
    "Pause:: {",
    "    global KlaviaOn, KlaviaLayer",
    "    KlaviaOn := !KlaviaOn",
    "    KlaviaLayer := false",
    `    TrayTip "Klavia", KlaviaOn ? "Включено" : "Выключено"`,
    "}",
    "",
    "Esc:: {",
    "    global KlaviaLayer",
    "    if KlaviaLayer {",
    "        KlaviaLayer := false",
    "        return",
    "    }",
    "    Send \"{Esc}\"",
    "}",
    "",
    "#HotIf KlaviaOn",
    "",
  ];

  if (layerSc) {
    lines.push(
      `${layerSc}:: {`,
      "    global KlaviaLayer",
      "    KlaviaLayer := true",
      "}",
      `+${layerSc}:: {`,
      "    global KlaviaLayer",
      "    KlaviaLayer := true",
      "}",
      "",
    );
  }

  const layerCodes = new Set(layer.map((s) => s.code));

  for (const slot of layer) {
    const sc = layerScan(slot.shortcut);
    if (!sc) continue;
    const L = typedChar(slot.letter, false);
    const U = typedChar(slot.letter, true);
    lines.push(
      `#HotIf KlaviaOn && KlaviaLayer`,
      `${sc}:: {`,
      `    global KlaviaLayer`,
      `    SendText "${escapeAhk(L)}"`,
      `    KlaviaLayer := false`,
      `}`,
      `+${sc}:: {`,
      `    global KlaviaLayer`,
      `    SendText "${escapeAhk(U)}"`,
      `    KlaviaLayer := false`,
      `}`,
      "",
    );
  }

  // Пока слой открыт, обычная буква всё равно печатается (слой просто снимается).
  for (const key of ALL_KEYS) {
    if (key.id === layerId) continue;
    if (layerCodes.has(key.id)) continue;
    const letter = layout[key.id]?.cyrillic;
    if (!letter) continue;
    const sc = ahkKeyName(key.latin);
    if (!sc) continue;
    const L = typedChar(letter, false);
    const U = typedChar(letter, true);
    lines.push(
      `#HotIf KlaviaOn && KlaviaLayer`,
      `${sc}:: {`,
      `    global KlaviaLayer`,
      `    SendText "${escapeAhk(L)}"`,
      `    KlaviaLayer := false`,
      `}`,
      `+${sc}:: {`,
      `    global KlaviaLayer`,
      `    SendText "${escapeAhk(U)}"`,
      `    KlaviaLayer := false`,
      `}`,
      "",
    );
  }

  lines.push("#HotIf KlaviaOn && !KlaviaLayer", "");

  for (const key of ALL_KEYS) {
    if (key.id === layerId) continue;
    const letter = layout[key.id]?.cyrillic;
    if (!letter) continue;
    const ahkKey = ahkKeyName(key.latin);
    if (!ahkKey) continue;
    const L = typedChar(letter, false);
    const U = typedChar(letter, true);
    lines.push(`${ahkKey}::SendText "${escapeAhk(L)}"`);
    lines.push(`+${ahkKey}::SendText "${escapeAhk(U)}"`);
  }

  lines.push("", "#HotIf", "");
  return lines.join("\n");
}

function layoutIsHebrew(layout: Record<KeyId, KeyMapping>): boolean {
  return ALL_KEYS.some((key) => {
    const letter = layout[key.id]?.cyrillic;
    return letter ? isHebrewChar(letter) : false;
  });
}

function escapeAhk(ch: string): string {
  return ch.replace(/"/g, '`"');
}

function layerScan(shortcut: string): string | null {
  return ahkDigitScan(shortcut) ?? ahkKeyName(shortcut);
}

/** Физические клавиши QWERTY — не зависят от текущей раскладки Windows. */
function ahkKeyName(latin: string): string | null {
  const map: Record<string, string> = {
    Q: "SC010",
    W: "SC011",
    E: "SC012",
    R: "SC013",
    T: "SC014",
    Y: "SC015",
    U: "SC016",
    I: "SC017",
    O: "SC018",
    P: "SC019",
    A: "SC01E",
    S: "SC01F",
    D: "SC020",
    F: "SC021",
    G: "SC022",
    H: "SC023",
    J: "SC024",
    K: "SC025",
    L: "SC026",
    Z: "SC02C",
    X: "SC02D",
    C: "SC02E",
    V: "SC02F",
    B: "SC030",
    N: "SC031",
    M: "SC032",
    "[": "SC01A",
    "]": "SC01B",
    ";": "SC027",
    "'": "SC028",
    ",": "SC033",
    ".": "SC034",
    "/": "SC035",
  };
  return map[latin] ?? map[latin.toUpperCase()] ?? null;
}

function ahkDigitScan(shortcut: string): string | null {
  const map: Record<string, string> = {
    "1": "SC002",
    "2": "SC003",
    "3": "SC004",
    "4": "SC005",
    "5": "SC006",
    "6": "SC007",
    "7": "SC008",
    "8": "SC009",
    "9": "SC00A",
    "0": "SC00B",
  };
  return map[shortcut] ?? null;
}

/** Linux: полный xkb + скрипт установки в ~/.config/xkb */
export function exportLinuxInstall(
  layout: Record<KeyId, KeyMapping>,
  layer: LayerSlot[],
): string {
  const symbolLines: string[] = [];
  for (const key of ALL_KEYS) {
    if (layout[key.id]?.kind === "layer") continue;
    const letter = layout[key.id]?.cyrillic;
    if (!letter) continue;
    symbolLines.push(
      `    key <${xkbKeysym(key.id)}> { [ ${u(lower(letter))}, ${u(upper(letter))} ] };`,
    );
  }

  // Dead-key style for Q is hard in simple xkb; document Q-layer as AHK/web for now
  // Put layer letters on unused keys as fallback for Linux system layout:
  const hebrew = layoutIsHebrew(layout);
  const fallback: [KeyId, string][] = hebrew
    ? []
    : [
        ["KeyW", layer.find((s) => s.shortcut === "3")?.letter ?? "Ш"],
        ["Comma", layer.find((s) => s.shortcut === "5")?.letter ?? "Ц"],
        ["Period", layer.find((s) => s.shortcut === "7")?.letter ?? "Ы"],
        ["Slash", layer.find((s) => s.shortcut === "4")?.letter ?? "Щ"],
        ["BracketLeft", layer.find((s) => s.shortcut === "6")?.letter ?? "Ъ"],
        ["BracketRight", layer.find((s) => s.shortcut === "0")?.letter ?? "Ё"],
        ["Semicolon", layer.find((s) => s.shortcut === "9")?.letter ?? "Э"],
        ["Quote", layer.find((s) => s.shortcut === "8")?.letter ?? "Ь"],
      ];
  // П on unused - use nothing else; add to KeyW conflict - W is Ш
  // Put П via include comment - use a second mapping: actually Key empty for П - map to nothing on main for layer-only in browser
  // For Linux installability, assign remaining on free keys:
  const assigned = new Set(
    ALL_KEYS.map((k) => layout[k.id]?.cyrillic?.toUpperCase()).filter(Boolean) as string[],
  );
  for (const [, letter] of fallback) assigned.add(letter.toUpperCase());
  const pe = layer.find((s) => s.letter === "П");
  // Use Grave? Not in ALL_KEYS. Leave П only via compose note.

  const symbols = `// ${hebrew ? "Klavia / Иврит" : "Klavia / Совпад"} — Linux xkb
partial alphanumeric_keys
xkb_symbols "klavia" {
    include "us(basic)"
    name[Group1]= "${hebrew ? "Hebrew (Klavia)" : "Russian (Klavia)"}";

${symbolLines.join("\n")}
${
  fallback.length
    ? `
    // Оставшиеся буквы на свободных клавишах (системный fallback;
    // в браузере и AHK они через Q → цифра):
${fallback
  .map(
    ([id, letter]) =>
      `    key <${xkbKeysym(id)}> { [ ${u(lower(letter))}, ${u(upper(letter))} ] };`,
  )
  .join("\n")}
${
  pe
    ? `    // П: в AHK/веб — Q затем 2. На Linux добавьте вручную при необходимости.`
    : ""
}`
    : `    // Концевые иврита: в AHK/веб — J затем K M N F C.`
}
};
`;

  const install = `#!/usr/bin/env bash
# Установка Klavia в пользовательский xkb (без root)
set -euo pipefail
DIR="$HOME/.config/xkb"
mkdir -p "$DIR/symbols" "$DIR/rules"
cp "$(dirname "$0")/klavia" "$DIR/symbols/klavia"
# Подключение: setxkbmap -I "$HOME/.config/xkb" -layout klavia -option
# Или добавьте в ~/.config/xkb/rules/evdev пару layout.
cat > "$DIR/README-klavia.txt" <<'EOF'
Klavia установлена в ~/.config/xkb/symbols/klavia

Включить (X11):
  setxkbmap -I "$HOME/.config/xkb" -layout us,klavia -option grp:alt_shift_toggle

Wayland (GNOME/KDE): импортируйте symbols через локальный xkb или используйте
браузерную версию / AutoHotkey-аналог не нужен — см. веб-приложение Klavia.
EOF
echo "Готово: $DIR/symbols/klavia"
`;

  return (
    "===== FILE: symbols/klavia =====\n" +
    symbols +
    "\n===== FILE: install-klavia.sh =====\n" +
    install +
    "\n===== NOTE =====\n" +
    "Минислой (Q→цифра или J→буква) полноценно работает в веб-приложении и Windows AHK.\n" +
    "На Linux в системной раскладке оставшиеся русские буквы продублированы на свободных клавишах.\n"
  );
}

function u(ch: string): string {
  return `U${unicodeU(ch)}`;
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

/** macOS .keylayout (XML) — базовая раскладка без dead-key слоя Q. */
export function exportMacKeylayout(
  layout: Record<KeyId, KeyMapping>,
  layer: LayerSlot[],
): string {
  // Map KeyId to Mac virtual key codes (ANSI)
  const macCodes: Partial<Record<KeyId, number>> = {
    KeyA: 0,
    KeyS: 1,
    KeyD: 2,
    KeyF: 3,
    KeyH: 4,
    KeyG: 5,
    KeyZ: 6,
    KeyX: 7,
    KeyC: 8,
    KeyV: 9,
    KeyB: 11,
    KeyQ: 12,
    KeyW: 13,
    KeyE: 14,
    KeyR: 15,
    KeyY: 16,
    KeyT: 17,
    KeyO: 31,
    KeyU: 32,
    KeyI: 34,
    KeyP: 35,
    KeyL: 37,
    KeyJ: 38,
    KeyK: 40,
    KeyN: 45,
    KeyM: 46,
    Semicolon: 41,
    Quote: 39,
    Comma: 43,
    Period: 47,
    Slash: 44,
    BracketLeft: 33,
    BracketRight: 30,
  };

  const hebrew = layoutIsHebrew(layout);
  const fallback: Partial<Record<KeyId, string>> = hebrew
    ? {}
    : {
        KeyW: layer.find((s) => s.shortcut === "3")?.letter,
        Comma: layer.find((s) => s.shortcut === "5")?.letter,
        Period: layer.find((s) => s.shortcut === "7")?.letter,
        Slash: layer.find((s) => s.shortcut === "4")?.letter,
        BracketLeft: layer.find((s) => s.shortcut === "6")?.letter,
        BracketRight: layer.find((s) => s.shortcut === "0")?.letter,
        Semicolon: layer.find((s) => s.shortcut === "9")?.letter,
        Quote: layer.find((s) => s.shortcut === "8")?.letter,
      };

  const map0: string[] = [];
  const map1: string[] = [];
  for (const key of ALL_KEYS) {
    const code = macCodes[key.id];
    if (code === undefined) continue;
    let letter = layout[key.id]?.cyrillic;
    if (layout[key.id]?.kind === "layer") letter = null;
    if (!letter) letter = fallback[key.id] ?? null;
    if (!letter) continue;
    map0.push(
      `        <key code="${code}" output="${xmlEscape(typedChar(letter, false))}" />`,
    );
    map1.push(
      `        <key code="${code}" output="${xmlEscape(typedChar(letter, true))}" />`,
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE keyboard SYSTEM "file://localhost/System/Library/DTDs/KeyboardLayout.dtd">
<!-- ${hebrew ? "Klavia / Иврит" : "Klavia / Совпад"} для macOS
  Установка:
  1) Скопируйте файл в ~/Library/Keyboard Layouts/
  2) Выйдите из системы и войдите снова
  3) Системные настройки → Клавиатура → Источники ввода → + → Другие → Klavia
  ${hebrew ? "Концевые: в веб/AHK — J затем K M N F C." : "Минислой Q→цифра: используйте веб-приложение или Windows AHK; здесь оставшиеся на свободных клавишах."}
-->
<keyboard group="0" id="${hebrew ? "-9282" : "-9281"}" name="${hebrew ? "Klavia Hebrew" : "Klavia"}" maxout="1">
  <layouts>
    <layout first="0" last="0" mapSet="ANSI" modifiers="Mods"/>
  </layouts>
  <modifierMap id="Mods" defaultIndex="0">
    <keyMapSelect mapIndex="0">
      <modifier keys=""/>
    </keyMapSelect>
    <keyMapSelect mapIndex="1">
      <modifier keys="anyShift"/>
    </keyMapSelect>
  </modifierMap>
  <keyMapSet id="ANSI">
    <keyMap index="0">
${map0.join("\n")}
    </keyMap>
    <keyMap index="1">
${map1.join("\n")}
    </keyMap>
  </keyMapSet>
</keyboard>
`;
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type DownloadBundle = {
  filename: string;
  mime: string;
  content: string;
  title: string;
  hint: string;
};

export function buildDownloadBundles(
  layout: Record<KeyId, KeyMapping>,
  layer: LayerSlot[],
): DownloadBundle[] {
  const hebrew = layoutIsHebrew(layout);
  return [
    {
      filename: hebrew ? "klavia-he.ahk" : "klavia.ahk",
      mime: "text/plain;charset=utf-8",
      content: exportWindowsAhk(layout, layer),
      title: "Windows — AutoHotkey",
      hint: hebrew
        ? "AHK v2, запустите файл. Pause — вкл/выкл. J затем K M N F C — концевые ך ם ן ף ץ."
        : "Любой ПК с Windows: установите AHK v2 и запустите файл. Pause — вкл/выкл. Q→цифра — слой.",
    },
    {
      filename: hebrew ? "Klavia-Hebrew.keylayout" : "Klavia.keylayout",
      mime: "application/xml;charset=utf-8",
      content: exportMacKeylayout(layout, layer),
      title: "macOS — .keylayout",
      hint: "Скопируйте в ~/Library/Keyboard Layouts/, перелогиньтесь, добавьте источник ввода.",
    },
    {
      filename: hebrew ? "klavia-he-linux.txt" : "klavia-linux.txt",
      mime: "text/plain;charset=utf-8",
      content: exportLinuxInstall(layout, layer),
      title: "Linux — xkb",
      hint: "Файлы symbols + install-скрипт внутри. См. комментарии в файле.",
    },
  ];
}
