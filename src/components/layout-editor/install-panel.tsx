"use client";

import { Button } from "@/components/ui/button";
import {
  buildDownloadBundles,
  type DownloadBundle,
} from "@/lib/os-exports";
import type { KeyId, KeyMapping, LayerSlot } from "@/lib/layout-data";
import { Download } from "lucide-react";
import { useMemo } from "react";

type Props = {
  layout: Record<KeyId, KeyMapping>;
  layer: LayerSlot[];
};

async function downloadBundle(bundle: DownloadBundle) {
  let content = bundle.content;
  if (!content) {
    const res = await fetch(`downloads/${bundle.filename}`);
    content = await res.text();
  }
  const blob = new Blob([content], { type: bundle.mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = bundle.filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function InstallPanel({ layout, layer }: Props) {
  const bundles = useMemo(
    () => buildDownloadBundles(layout, layer),
    [layout, layer],
  );

  return (
    <section
      id="install"
      className="scroll-mt-8 space-y-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 p-5 backdrop-blur-sm"
    >
      <div>
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--ink-faint)]">
          Windows
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Установка
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)]">
          Сайт работает сразу. Чтобы печатать во всех программах — AutoHotkey и
          один файл{" "}
          <span className="font-[family-name:var(--font-mono)]">klavia.ahk</span>.
        </p>
      </div>

      <ol className="list-decimal space-y-3 pl-5 text-sm text-[var(--ink)]">
        <li>
          <span className="font-medium">Поставьте AutoHotkey v2</span>
          {" — "}
          <a
            href="https://www.autohotkey.com/"
            className="text-[var(--accent)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            autohotkey.com
          </a>
          . При установке выберите v2.
        </li>
        <li>
          <span className="font-medium">Для кнопки ИВРИТ</span> добавьте язык
          «Иврит»: Параметры → Время и язык → Язык и регион → Добавление языка.
          РУ и АНГЛ обычно уже есть.
        </li>
        <li>
          <span className="font-medium">Скачайте</span>{" "}
          <span className="font-[family-name:var(--font-mono)]">klavia.ahk</span>{" "}
          ниже и откройте двойным щелчком. В трее появится иконка Klavia.
        </li>
        <li>
          <span className="font-medium">Pause</span> листает по кругу: РУ → АНГЛ
          → ИВРИТ → РУ-КЛАВИА → ИВРИТ-КЛАВИА. Правый клик по иконке в трее —
          выбрать сразу.
        </li>
        <li>
          Автозапуск: Win+R →{" "}
          <span className="font-[family-name:var(--font-mono)]">shell:startup</span>{" "}
          → ярлык на{" "}
          <span className="font-[family-name:var(--font-mono)]">klavia.ahk</span>.
        </li>
      </ol>

      <p className="text-sm text-[var(--ink-muted)]">
        РУ-КЛАВИА: Q затем цифра 2–0, Б на V. ИВРИТ-КЛАВИА: справа налево; J
        затем K M N F C — концевые.
      </p>

      <ul className="space-y-3">
        {bundles.map((bundle) => (
          <li
            key={bundle.filename}
            className="flex flex-col gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-[var(--ink)]">{bundle.title}</p>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">{bundle.hint}</p>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-[var(--ink-faint)]">
                {bundle.filename}
              </p>
            </div>
            <Button size="sm" onClick={() => downloadBundle(bundle)}>
              <Download className="h-3.5 w-3.5" /> Скачать
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
