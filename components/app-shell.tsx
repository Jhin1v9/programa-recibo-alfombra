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
    previewCompany,
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
    { href: "/entrega" as Route, label: t("nav.delivery"), note: t("nav.deliveryNote"), tag: "05" },
    { href: "/configuracion" as Route, label: t("nav.settings"), note: t("nav.settingsNote"), tag: "06" }
  ];
  const isActiveRoute = (href: Route) => {
    if (href === ("/" as Route)) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const activeNavItem = navItems.find((item) => isActiveRoute(item.href)) || navItems[0];

  return (
    <div className="app-root min-h-screen overflow-x-clip px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-4 xl:grid xl:grid-cols-[292px_minmax(0,1fr)] xl:gap-6">
        <section className="xl:hidden">
          <div className="grid gap-4">
            <div className="panel-card rounded-[28px] p-4">
              <div className="flex items-start gap-3">
                <BrandMark compact imageDataUrl={previewCompany.companyLogoDataUrl} />
                <div className="min-w-0">
                  <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--brand)]">
                    {t("sidebar.workspace")}
                  </p>
                  <h1 className="mt-1 text-lg leading-5 text-[color:var(--ink)]">
                    Recibos Alfombra Studio
                  </h1>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-[color:var(--line)] bg-white px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.24em] text-[color:var(--brand)]">
                      {activeNavItem.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                      {activeNavItem.note}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[color:var(--line)] bg-[rgba(15,23,42,0.04)] px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
                    {activeNavItem.tag}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">{t("sidebar.description")}</p>
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
          <div className="rounded-[24px] border border-[color:var(--line)] bg-white px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <BrandMark imageDataUrl={previewCompany.companyLogoDataUrl} />
              <span className="inline-flex rounded-full border border-[color:var(--line)] bg-[rgba(15,23,42,0.04)] px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
                {t("sidebar.workspace")}
              </span>
            </div>
            <div className="mt-4 rounded-[20px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.94))] px-4 py-4">
              <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-[color:var(--brand)]">
                {activeNavItem.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{activeNavItem.note}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
                <div className="rounded-2xl border border-[color:var(--line)] bg-white px-3 py-3 text-center">
                  A4 PDF
                </div>
                <div className="rounded-2xl border border-[color:var(--line)] bg-white px-3 py-3 text-center">
                  VCF CSV
                </div>
              </div>
            </div>
          </div>

          <nav className="mt-5 grid gap-2">
            {navItems.map((item) => {
              const active = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[22px] border px-4 py-3 transition ${
                    active
                      ? "border-[rgba(191,95,52,0.38)] bg-[linear-gradient(135deg,rgba(255,246,240,0.98),rgba(255,255,255,0.96))] shadow-[0_12px_24px_rgba(191,95,52,0.08)]"
                      : "border-[color:var(--line)] bg-white/72 hover:border-[rgba(15,23,42,0.14)] hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--line)] bg-[rgba(15,23,42,0.04)] text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]">
                      {item.tag}
                    </span>
                    <div className="min-w-0">
                      <strong className="block text-sm text-[color:var(--ink)]">{item.label}</strong>
                      <span className="mt-1 block text-sm text-[color:var(--ink-soft)]">
                        {item.note}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 rounded-[24px] border border-[color:var(--line)] bg-white/72 p-4">
            <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-[color:var(--brand)]">
              {t("sidebar.state")}
            </p>
            <div className="mt-4 grid gap-3 xl:grid-cols-1">
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
      className={`rounded-[22px] border px-4 ${compact ? "bg-[rgba(15,23,42,0.04)] py-3" : "bg-white/70 py-4"}`}
      style={{
        borderColor: compact ? "rgba(15, 23, 42, 0.08)" : "var(--line)"
      }}
    >
      <strong
        className={`block break-words ${compact ? "text-base leading-5" : "text-lg leading-6"} ${
          compact ? "text-[color:var(--ink)]" : "text-[color:var(--ink)]"
        }`}
      >
        {value}
      </strong>
      <span
        className={`mt-4 block text-xs font-extrabold uppercase tracking-[0.18em] ${
          compact ? "text-[color:var(--ink-soft)]" : "text-[color:var(--ink-soft)]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
