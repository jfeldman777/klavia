import type { KeyId, KeyMapping, LayerSlot } from "./layout-data";
import { ALL_KEYS, LAYER_KEY_ID } from "./layout-data";

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
  const lines = [
    "; Klavia / Совпад — портативная раскладка для Windows (AutoHotkey v2)",
    "; 1) Установите AutoHotkey v2: https://www.autohotkey.com/",
    "; 2) Запустите этот файл — раскладка активна в любом приложении",
    "; 3) Переключение: Pause (или правый Ctrl+Space) — вкл/выкл",
    "; Q затем 1–0 — миниклавиатура оставшихся букв",
    "#Requires AutoHotkey v2.0",
    "#SingleInstance Force",
    "SendMode \"Input\"",
    "",
    "global KlaviaOn := true",
    "global KlaviaLayer := false",
    "",
    "TrayTip \"Klavia\", \"Раскладка включена. Pause — вкл/выкл.\"",
    "",
    "Pause:: {",
    "    global KlaviaOn, KlaviaLayer",
    "    KlaviaOn := !KlaviaOn",
    "    KlaviaLayer := false",
    "    TrayTip \"Klavia\", KlaviaOn ? \"Включено\" : \"Выключено\"",
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

  // Layer key Q
  lines.push(
    "q:: {",
    "    global KlaviaLayer",
    "    KlaviaLayer := true",
    "}",
    "+q:: {",
    "    global KlaviaLayer",
    "    KlaviaLayer := true",
    "}",
    "",
  );

  for (const slot of layer) {
    const L = lower(slot.letter);
    const U = upper(slot.letter);
    lines.push(
      `#HotIf KlaviaOn && KlaviaLayer`,
      `${slot.shortcut}:: {`,
      `    global KlaviaLayer`,
      `    SendText "${L}"`,
      `    KlaviaLayer := false`,
      `}`,
      `+${slot.shortcut}:: {`,
      `    global KlaviaLayer`,
      `    SendText "${U}"`,
      `    KlaviaLayer := false`,
      `}`,
      "",
    );
  }

  lines.push("#HotIf KlaviaOn && !KlaviaLayer", "");

  for (const key of ALL_KEYS) {
    if (key.id === LAYER_KEY_ID) continue;
    const letter = layout[key.id]?.cyrillic;
    if (!letter) continue;
    const ahkKey = ahkKeyName(key.latin);
    if (!ahkKey) continue;
    const L = lower(letter);
    const U = upper(letter);
    lines.push(`${ahkKey}::SendText "${L}"`);
    lines.push(`+${ahkKey}::SendText "${U}"`);
  }

  lines.push("", "#HotIf", "");
  return lines.join("\n");
}

function ahkKeyName(latin: string): string | null {
  const map: Record<string, string> = {
    "[": "[",
    "]": "]",
    ";": ";",
    "'": "'",
    ",": ",",
    ".": ".",
    "/": "/",
  };
  if (/^[A-Za-z]$/.test(latin)) return latin.toLowerCase();
  return map[latin] ?? null;
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
  const fallback: [KeyId, string][] = [
    ["KeyW", layer.find((s) => s.shortcut === "3")?.letter ?? "Ш"],
    ["KeyV", layer.find((s) => s.shortcut === "1")?.letter ?? "Б"],
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

  const symbols = `// Klavia / Совпад — Linux xkb
partial alphanumeric_keys
xkb_symbols "klavia" {
    include "us(basic)"
    name[Group1]= "Russian (Klavia)";

${symbolLines.join("\n")}

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
    "Минислой Q→цифра полноценно работает в веб-приложении и Windows AHK.\n" +
    "На Linux в системной раскладке оставшиеся буквы продублированы на свободных клавишах.\n"
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

  const fallback: Partial<Record<KeyId, string>> = {
    KeyW: layer.find((s) => s.shortcut === "3")?.letter,
    KeyV: layer.find((s) => s.shortcut === "1")?.letter,
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
      `        <key code="${code}" output="${xmlEscape(lower(letter))}" />`,
    );
    map1.push(
      `        <key code="${code}" output="${xmlEscape(upper(letter))}" />`,
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE keyboard SYSTEM "file://localhost/System/Library/DTDs/KeyboardLayout.dtd">
<!-- Klavia / Совпад для macOS
  Установка:
  1) Скопируйте Klavia.keylayout в ~/Library/Keyboard Layouts/
  2) Выйдите из системы и войдите снова
  3) Системные настройки → Клавиатура → Источники ввода → + → Другие → Klavia
  Минислой Q→цифра: используйте веб-приложение или Windows AHK; здесь оставшиеся на свободных клавишах.
-->
<keyboard group="0" id="-9281" name="Klavia" maxout="1">
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
  return [
    {
      filename: "klavia.ahk",
      mime: "text/plain;charset=utf-8",
      content: exportWindowsAhk(layout, layer),
      title: "Windows — AutoHotkey",
      hint: "Любой ПК с Windows: установите AHK v2 и запустите файл. Pause — вкл/выкл. Q→цифра — слой.",
    },
    {
      filename: "Klavia.keylayout",
      mime: "application/xml;charset=utf-8",
      content: exportMacKeylayout(layout, layer),
      title: "macOS — .keylayout",
      hint: "Скопируйте в ~/Library/Keyboard Layouts/, перелогиньтесь, добавьте источник ввода.",
    },
    {
      filename: "klavia-linux.txt",
      mime: "text/plain;charset=utf-8",
      content: exportLinuxInstall(layout, layer),
      title: "Linux — xkb",
      hint: "Файлы symbols + install-скрипт внутри. См. комментарии в файле.",
    },
  ];
}
