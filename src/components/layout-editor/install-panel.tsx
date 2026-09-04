"use client";

import { Button } from "@/components/ui/button";
import {
  buildDownloadBundles,
  type DownloadBundle,
} from "@/lib/os-exports";
import type { KeyId, KeyMapping, LayerSlot } from "@/lib/layout-data";
import { Download, Monitor, Globe } from "lucide-react";
import { useMemo } from "react";

type Props = {
  layout: Record<KeyId, KeyMapping>;
  layer: LayerSlot[];
};

function downloadBundle(bundle: DownloadBundle) {
  const blob = new Blob([bundle.content], { type: bundle.mime });
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
          На любом компьютере
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Как пользоваться Klavia / Совпад
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)]">
          Три способа: веб (сразу), Windows AHK (во всех программах), файлы
          раскладки для macOS / Linux.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--match-line)] bg-[var(--match-bg)] p-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--match)]">
            <Globe className="h-4 w-4" />
            <span className="font-medium">Веб — любой ПК и ОС</span>
          </div>
          <p className="text-sm text-[var(--ink-muted)]">
            Откройте сайт Klavia в браузере, печатайте в поле проверки. Q →
            цифра для оставшихся букв. Работает без установки.
          </p>
          <a
            href="#editor"
            className="mt-3 inline-block text-sm text-[var(--accent)] underline-offset-2 hover:underline"
          >
            К редактору и проверке →
          </a>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--ink)]">
            <Monitor className="h-4 w-4" />
            <span className="font-medium">Система — во всех приложениях</span>
          </div>
          <p className="text-sm text-[var(--ink-muted)]">
            Скачайте файл под вашу ОС ниже. На Windows удобнее всего AutoHotkey:
            один файл, Pause включает/выключает.
          </p>
        </div>
      </div>

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
