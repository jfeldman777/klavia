import { LayoutEditor } from "@/components/layout-editor/layout-editor";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <div className="hero-grid pointer-events-none absolute inset-x-0 top-0 h-[70vh]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 pt-6 sm:px-8">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-[var(--ink-faint)]">
          раскладка · совпад
        </p>
        <a
          href="#editor"
          className="text-sm text-[var(--accent)] underline-offset-4 hover:underline"
        >
          К редактору
        </a>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <section className="mb-14 max-w-3xl animate-rise">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.6rem,8vw,4.6rem)] font-semibold leading-[0.95] tracking-tight text-[var(--ink)]">
            Совпад
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)] animate-rise-delay">
            Графика:{" "}
            <span className="text-[var(--match)]">О←O · Р←P · В←B · М←M</span>.
            Полусовпадения:{" "}
            <span className="text-[var(--semi)]">Я←R · И←N</span>. Звук:{" "}
            <span className="text-[var(--sound)]">
              Г←G · Д←D · Ж←J · З←Z · Л←L · Ю←U · Ф←F
            </span>
            . Доп.:{" "}
            <span className="text-[var(--extra)]">Й←I · Ч←S · Б←V</span>. Остальные —
            через{" "}
            <span className="text-[var(--layer)]">Q → миниклавиатуру</span>.
            Иврит — клавиа-ивр на тех же клавишах, справа налево; концевые:{" "}
            <span className="text-[var(--layer)]">J затем буква</span>.
            На Windows Pause листает стандарт рус / англ / стандарт ивр /
            клавиа-ру / клавиа-ивр.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-rise-delay-2">
            <a
              href="#editor"
              className="inline-flex h-11 items-center rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-fg)] transition hover:brightness-110"
            >
              Собрать раскладку
            </a>
            <a
              href="#install"
              className="inline-flex h-11 items-center rounded-md border border-[var(--line)] bg-[var(--surface-2)] px-5 text-sm text-[var(--ink)] transition hover:bg-[var(--surface-3)]"
            >
              Установить на ПК
            </a>
          </div>
        </section>

        <section id="editor" className="scroll-mt-8 animate-rise-delay-2">
          <LayoutEditor />
        </section>

        </main>

      <footer className="relative z-10 border-t border-[var(--line)] py-6 text-center text-sm text-[var(--ink-faint)]">
        Совпад · правьте в браузере, экспортируйте JSON или xkb
      </footer>
    </div>
  );
}
