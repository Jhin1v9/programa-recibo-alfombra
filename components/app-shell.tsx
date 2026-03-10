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
  const navItems: ReadonlyArray<{
    href: Route;
    label: string;
    note: string;
    icon: "home" | "company" | "clients" | "receipts" | "delivery" | "settings";
  }> = [
    { href: "/" as Route, label: t("nav.home"), note: t("nav.homeNote"), icon: "home" },
    { href: "/empresa" as Route, label: t("nav.company"), note: t("nav.companyNote"), icon: "company" },
    { href: "/clientes" as Route, label: t("nav.clients"), note: t("nav.clientsNote"), icon: "clients" },
    { href: "/recibos" as Route, label: t("nav.receipts"), note: t("nav.receiptsNote"), icon: "receipts" },
    { href: "/entrega" as Route, label: t("nav.delivery"), note: t("nav.deliveryNote"), icon: "delivery" },
    { href: "/configuracion" as Route, label: t("nav.settings"), note: t("nav.settingsNote"), icon: "settings" }
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
            <div className="panel-card rounded-[26px] p-4">
              <div className="flex items-start gap-3">
                <BrandMark compact imageDataUrl={previewCompany.companyLogoDataUrl} />
                <div className="min-w-0">
                  <h1 className="text-lg leading-5 text-[color:var(--ink)]">
                    Recibos Alfombra Studio
                  </h1>
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-[color:var(--line)] bg-white px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.24em] text-[color:var(--brand)]">
                      {activeNavItem.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                      {activeNavItem.note}
                    </p>
                  </div>
                  <SidebarIcon icon={activeNavItem.icon} active />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SidebarMiniMetric label={t("sidebar.clients")} value={String(clients.length)} />
                  <SidebarMiniMetric label={t("sidebar.receipts")} value={String(receipts.length)} />
                  <SidebarMiniMetric
                    label={t("sidebar.selected")}
                    value={selectionLabel}
                    wide
                  />
                </div>
              </div>
            </div>

            <nav className="grid grid-cols-3 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {navItems.map((item) => {
                const active = isActiveRoute(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mobile-nav-card rounded-[20px] border p-3 transition ${
                      active
                        ? "border-[rgba(191,95,52,0.38)] bg-[linear-gradient(135deg,rgba(255,246,240,0.98),rgba(255,255,255,0.96))] shadow-[0_18px_34px_rgba(191,95,52,0.1)]"
                        : "border-[color:var(--line)] bg-white/90 hover:border-[rgba(15,23,42,0.18)] hover:bg-white"
                    }`}
                  >
                    <div className="flex h-full flex-col justify-between gap-3">
                      <div className="flex items-center justify-between gap-3">
                        <SidebarIcon icon={item.icon} active={active} />
                        {active ? (
                          <span className="hidden rounded-full border border-[rgba(191,95,52,0.18)] bg-[rgba(191,95,52,0.1)] px-2.5 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-[color:var(--brand)] sm:inline-flex">
                            {t("receipts.current")}
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <strong className="block break-words text-[0.9rem] leading-[1.15] text-[color:var(--ink)] [overflow-wrap:anywhere] sm:text-base">
                          {item.label}
                        </strong>
                        <span className="mt-2 hidden text-[0.92rem] leading-5 text-[color:var(--ink-soft)] sm:block">
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

        <aside className="app-sidebar panel-card hidden h-fit overflow-hidden rounded-[28px] p-4 xl:sticky xl:top-6 xl:block">
          <div className="rounded-[22px] border border-[color:var(--line)] bg-white px-4 py-4">
            <div>
              <BrandMark imageDataUrl={previewCompany.companyLogoDataUrl} />
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

          <nav className="mt-4 grid gap-2">
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
                    <div className="mt-0.5">
                      <SidebarIcon icon={item.icon} active={active} />
                    </div>
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

          <div className="mt-4 rounded-[22px] border border-[color:var(--line)] bg-white/72 p-4">
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

function SidebarIcon({
  icon,
  active = false
}: Readonly<{
  icon: "home" | "company" | "clients" | "receipts" | "delivery" | "settings";
  active?: boolean;
}>) {
  const stroke = active ? "var(--brand)" : "var(--ink-soft)";

  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${
        active
          ? "border-[rgba(191,95,52,0.24)] bg-[rgba(191,95,52,0.08)]"
          : "border-[color:var(--line)] bg-[rgba(15,23,42,0.04)]"
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        {icon === "home" ? (
          <>
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5.5 9.5V20h13V9.5" />
            <path d="M10 20v-5h4v5" />
          </>
        ) : null}
        {icon === "company" ? (
          <>
            <path d="M4 20h16" />
            <path d="M6 20V8l6-4 6 4v12" />
            <path d="M9 11h.01" />
            <path d="M15 11h.01" />
            <path d="M9 15h.01" />
            <path d="M15 15h.01" />
          </>
        ) : null}
        {icon === "clients" ? (
          <>
            <path d="M16 19a4 4 0 0 0-8 0" />
            <circle cx="12" cy="8" r="3.2" />
            <path d="M20 18a3 3 0 0 0-2.5-2.95" />
            <path d="M6.5 15.05A3 3 0 0 0 4 18" />
          </>
        ) : null}
        {icon === "receipts" ? (
          <>
            <path d="M7 4.5h10v15l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4V4.5Z" />
            <path d="M9 9h6" />
            <path d="M9 12.5h6" />
            <path d="M9 16h4" />
          </>
        ) : null}
        {icon === "delivery" ? (
          <>
            <path d="M3 8h11v8H3z" />
            <path d="M14 11h3l2 2v3h-5z" />
            <circle cx="7.5" cy="18" r="1.5" />
            <circle cx="17.5" cy="18" r="1.5" />
          </>
        ) : null}
        {icon === "settings" ? (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 0 1-4 0v-.2a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 0 1 0-4h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.2a1 1 0 0 0 .6-.9V4a2 2 0 0 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.2a1 1 0 0 0 .9.6H20a2 2 0 0 1 0 4h-.2a1 1 0 0 0-.9.6Z" />
          </>
        ) : null}
      </svg>
    </span>
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

function SidebarMiniMetric({
  label,
  value,
  wide = false
}: Readonly<{ label: string; value: string; wide?: boolean }>) {
  return (
    <div
      className={`rounded-full border border-[color:var(--line)] bg-[rgba(15,23,42,0.04)] px-3 py-2 ${
        wide ? "w-full" : ""
      }`}
    >
      <div className={`flex items-center gap-2 ${wide ? "justify-between" : ""}`}>
        <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
          {label}
        </span>
        <strong
          className={`text-sm leading-none text-[color:var(--ink)] ${
            wide ? "max-w-[56%] truncate text-right" : ""
          }`}
          title={value}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}
