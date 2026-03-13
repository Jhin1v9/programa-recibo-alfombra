"use client";

import { useReceiptApp } from "@/components/receipt-app-provider";
import { PageIntro, SectionCard, buttonClasses } from "@/components/workspace-ui";

export function SettingsPage() {
  const { language, languageOptions, setLanguage, t } = useReceiptApp();

  return (
    <>
      <PageIntro
        eyebrow={t("settings.eyebrow")}
        title={t("settings.title")}
        description={t("settings.description")}
      />

      <div className="grid gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <SectionCard eyebrow={t("settings.language")} title={t("settings.languageTitle")}>
          <p className="mb-5 max-w-[62ch] text-sm leading-7 text-[color:var(--ink-soft)]">
            {t("settings.languageText")}
          </p>

          <div className="grid gap-5 lg:grid-cols-3">
            {languageOptions.map((option) => {
              const active = option.code === language;

              return (
                <article
                  key={option.code}
                  className={`rounded-[26px] border p-5 transition ${
                    active
                      ? "border-[rgba(191,95,52,0.55)] bg-white shadow-[inset_0_0_0_1px_rgba(191,95,52,0.15)]"
                      : "border-[color:var(--line)] bg-[color:var(--surface-strong)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xl leading-none text-[color:var(--ink)]">{t(option.labelKey)}</p>
                      <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[color:var(--ink-soft)]">
                        {option.code}
                      </p>
                    </div>
                    {active ? (
                      <span className="inline-flex rounded-full border border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)] px-3 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                        {t("settings.languageActive")}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      className={buttonClasses(active ? "ghost" : "primary")}
                      onClick={() => setLanguage(option.code)}
                      disabled={active}
                    >
                      {active ? t("settings.languageActive") : t("settings.languageAction")}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard eyebrow={t("settings.notes")} title={t("settings.notesTitle")}>
          <div className="space-y-5 text-sm leading-7 text-[color:var(--ink-soft)]">
            <NoteCard text={t("settings.notesOne")} />
            <NoteCard text={t("settings.notesTwo")} />
            <NoteCard text={t("settings.notesThree")} />
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function NoteCard({ text }: Readonly<{ text: string }>) {
  return (
    <div className="rounded-[22px] border border-[color:var(--line)] bg-white/72 px-4 py-3">
      <p>{text}</p>
    </div>
  );
}
