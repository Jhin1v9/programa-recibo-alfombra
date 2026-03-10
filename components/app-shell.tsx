"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
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
  const navItems: ReadonlyArray<{ href: Route; label: string; note: string; tag: string }> = [
    { href: "/" as Route, label: t("nav.home"), note: t("nav.homeNote"), tag: "01" },
    { href: "/empresa" as Route, label: t("nav.company"), note: t("nav.companyNote"), tag: "02" },
    { href: "/clientes" as Route, label: t("nav.clients"), note: t("nav.clientsNote"), tag: "03" },
    { href: "/recibos" as Route, label: t("nav.receipts"), note: t("nav.receiptsNote"), tag: "04" },
    { href: "/configuracion" as Route, label: t("nav.settings"), note: t("nav.settingsNote"), tag: "05" }
  ];
  const isActiveRoute = (href: Route) =>
    pathname === href || (href === ("/recibos" as Route) && pathname.startsWith("/recibos"));
  const activeNavItem = navItems.find((item) => isActiveRoute(item.href)) || navItems[0];

  return (
    <div className="app-root min-h-screen overflow-x-clip px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-4 xl:grid xl:grid-cols-[292px_minmax(0,1fr)] xl:gap-6">
        <section className="xl:hidden">
          <div className="grid gap-4">
            <div className="panel-card rounded-[28px] p-4">
              <div className="flex items-start justify-between gap-4">
                <BrandMark />
                <div className="rounded-[20px] border border-[color:var(--line)] bg-white px-3 py-2 text-right">
                  <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--brand)]">
                    {activeNavItem.label}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--ink-soft)]">{activeNavItem.note}</p>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] bg-[linear-gradient(135deg,#0f172a_0%,#13233d_58%,#173a35_100%)] px-4 py-4 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.24em] text-amber-200/78">
                      {t("sidebar.workspace")}
                    </p>
                    <h1 className="mt-2 text-[1.8rem] leading-[0.95]">Recibos Alfombra Studio</h1>
                  </div>
                  <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/76">
                    App
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/76">{t("sidebar.description")}</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <SidebarMetric label={t("sidebar.clients")} value={String(clients.length)} compact />
                  <SidebarMetric label={t("sidebar.receipts")} value={String(receipts.length)} compact />
                  <SidebarMetric label={t("sidebar.selected")} value={selectionLabel} compact />
                </div>
              </div>
            </div>

            <nav className="grid grid-cols-2 gap-3">
              {navItems.map((item) => {
                const active = isActiveRoute(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mobile-nav-card aspect-square rounded-[24px] border p-4 transition ${
                      active
                        ? "border-[rgba(191,95,52,0.38)] bg-[linear-gradient(135deg,rgba(255,246,240,0.98),rgba(255,255,255,0.96))] shadow-[0_18px_34px_rgba(191,95,52,0.1)]"
                        : "border-[color:var(--line)] bg-white/90 hover:border-[rgba(15,23,42,0.18)] hover:bg-white"
                    }`}
                  >
                    <div className="flex h-full flex-col justify-between gap-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-[color:var(--line)] bg-[rgba(15,23,42,0.04)] px-2.5 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
                          {item.tag}
                        </span>
                        {active ? (
                          <span className="rounded-full border border-[rgba(191,95,52,0.18)] bg-[rgba(191,95,52,0.1)] px-2.5 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-[color:var(--brand)]">
                            {t("receipts.current")}
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <strong className="block text-base leading-5 text-[color:var(--ink)]">
                          {item.label}
                        </strong>
                        <span className="mt-2 block text-sm leading-5 text-[color:var(--ink-soft)]">
                          {item.note}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>

        <aside className="app-sidebar panel-card hidden h-fit overflow-hidden rounded-[30px] p-5 xl:sticky xl:top-6 xl:block">
          <div className="hero-card rounded-[26px] p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <BrandMark light />
              <span className="inline-flex rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white/76">
                {t("sidebar.workspace")}
              </span>
            </div>
            <h1 className="mt-5 max-w-[12ch] text-3xl leading-none">Recibos Alfombra Studio</h1>
            <p className="mt-3 text-sm leading-7 text-white/76">
              {t("sidebar.description")}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-white/70">
              <div className="rounded-2xl border border-white/10 bg-white/7 px-3 py-3">
                A4 PDF
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/7 px-3 py-3">
                VCF CSV
              </div>
            </div>
          </div>

          <nav className="mt-5 grid grid-cols-2 gap-2 xl:flex xl:grid-cols-1 xl:flex-col">
            {navItems.map((item) => {
              const active = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[22px] border px-4 py-3 transition ${
                    active
                      ? "border-[rgba(191,95,52,0.38)] bg-[linear-gradient(135deg,rgba(191,95,52,0.12),rgba(255,255,255,0.92))] shadow-[inset_0_0_0_1px_rgba(191,95,52,0.12)]"
                      : "border-transparent hover:border-[color:var(--line)] hover:bg-white"
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
            <div className="mt-4 rounded-[20px] border border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(242,245,249,0.9))] px-4 py-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              {t("sidebar.nextNumber")}:{" "}
              <strong className="text-[color:var(--ink)]">{nextReceiptSuggestion}</strong>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-4 md:gap-6">
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

function SidebarMetric({
  label,
  value,
  compact = false
}: Readonly<{ label: string; value: string; compact?: boolean }>) {
  return (
    <div
      className={`rounded-[22px] border px-4 ${compact ? "bg-white/8 py-3 text-white" : "bg-white/70 py-4"}`}
      style={{
        borderColor: compact ? "rgba(255, 255, 255, 0.1)" : "var(--line)"
      }}
    >
      <strong
        className={`block break-words ${compact ? "text-base leading-5" : "text-lg leading-6"} ${
          compact ? "text-white" : "text-[color:var(--ink)]"
        }`}
      >
        {value}
      </strong>
      <span
        className={`mt-4 block text-xs font-extrabold uppercase tracking-[0.18em] ${
          compact ? "text-white/72" : "text-[color:var(--ink-soft)]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
