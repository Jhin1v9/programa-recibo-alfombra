"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import { useReceiptApp } from "@/components/receipt-app-provider";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const {
    clients,
    receipts,
    selectionLabel,
    nextReceiptSuggestion,
    feedback,
    dismissFeedback,
    t
  } = useReceiptApp();
  const navItems: ReadonlyArray<{ href: Route; label: string; note: string }> = [
    { href: "/" as Route, label: t("nav.home"), note: t("nav.homeNote") },
    { href: "/empresa" as Route, label: t("nav.company"), note: t("nav.companyNote") },
    { href: "/clientes" as Route, label: t("nav.clients"), note: t("nav.clientsNote") },
    { href: "/recibos" as Route, label: t("nav.receipts"), note: t("nav.receiptsNote") },
    { href: "/configuracion" as Route, label: t("nav.settings"), note: t("nav.settingsNote") }
  ];

  return (
    <div className="app-root min-h-screen overflow-x-clip px-4 py-4 md:px-6 md:py-6">
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="app-sidebar panel-card h-fit overflow-hidden rounded-[30px] p-5 xl:sticky xl:top-6">
          <div className="hero-card rounded-[26px] p-5 text-white">
            <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.28em] text-amber-200/80">
              {t("sidebar.workspace")}
            </p>
            <h1 className="mt-3 max-w-[10ch] text-3xl leading-none">Recibos Alfombra Studio</h1>
            <p className="mt-3 text-sm leading-7 text-white/76">
              {t("sidebar.description")}
            </p>
          </div>

          <nav className="mt-5 flex flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[22px] border px-4 py-3 transition ${
                    active
                      ? "border-[rgba(191,95,52,0.55)] bg-[rgba(191,95,52,0.08)]"
                      : "border-transparent hover:border-[color:var(--line)] hover:bg-white/60"
                  }`}
                >
                  <strong className="block text-sm text-[color:var(--ink)]">{item.label}</strong>
                  <span className="mt-1 block text-sm text-[color:var(--ink-soft)]">{item.note}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 rounded-[24px] border border-[color:var(--line)] bg-white/72 p-4">
            <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-[color:var(--brand)]">
              {t("sidebar.state")}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <SidebarMetric label={t("sidebar.clients")} value={String(clients.length)} />
              <SidebarMetric label={t("sidebar.receipts")} value={String(receipts.length)} />
              <SidebarMetric label={t("sidebar.selected")} value={selectionLabel} />
            </div>
            <div className="mt-4 rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              {t("sidebar.nextNumber")}:{" "}
              <strong className="text-[color:var(--ink)]">{nextReceiptSuggestion}</strong>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          {children}

          <div
            className={`app-feedback rounded-[22px] px-4 py-3 text-sm font-extrabold ${
              feedback
                ? feedback.kind === "error"
                  ? "bg-[rgba(163,49,49,0.1)] text-[color:var(--danger)]"
                  : "bg-[rgba(23,97,68,0.12)] text-[color:var(--success)]"
                : "bg-transparent text-transparent"
            }`}
            role="status"
            aria-live="polite"
            onClick={() => dismissFeedback()}
          >
            {feedback?.message || t("sidebar.idle")}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarMetric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-[22px] border border-[color:var(--line)] bg-white/70 px-4 py-4">
      <strong className="block break-words text-lg leading-6 text-[color:var(--ink)]">{value}</strong>
      <span className="mt-4 block text-xs font-extrabold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
        {label}
      </span>
    </div>
  );
}
