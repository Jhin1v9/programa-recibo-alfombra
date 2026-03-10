import type { Route } from "next";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type FieldConfig<Name extends string> = {
  name: Name;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "date" | "search";
  full?: boolean;
  multiline?: boolean;
  rows?: number;
};

export type { ButtonVariant, FieldConfig };

export function buttonClasses(variant: ButtonVariant) {
  const base =
    "inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-extrabold transition duration-200 disabled:cursor-not-allowed disabled:opacity-45";

  if (variant === "primary") {
    return `${base} bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)] hover:-translate-y-0.5`;
  }

  if (variant === "secondary") {
    return `${base} bg-[linear-gradient(135deg,var(--brand)_0%,var(--brand-deep)_100%)] text-white shadow-[0_16px_30px_rgba(191,95,52,0.18)] hover:-translate-y-0.5`;
  }

  if (variant === "danger") {
    return `${base} bg-[linear-gradient(135deg,rgba(163,49,49,0.13),rgba(255,255,255,0.92))] text-[color:var(--danger)] hover:-translate-y-0.5`;
  }

  return `${base} border border-[color:var(--line)] bg-white text-[color:var(--ink)] hover:-translate-y-0.5`;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  actions
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}>) {
  return (
    <section className="panel-card fade-up rounded-[24px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,252,0.94))] p-4 md:rounded-[28px] md:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="rounded-full border border-[color:var(--line)] bg-[rgba(15,23,42,0.04)] px-3 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.24em] text-[color:var(--brand)]">
              {eyebrow}
            </p>
          </div>
          <h1 className="max-w-[22ch] text-[1.7rem] leading-[0.98] text-[color:var(--ink)] md:max-w-[28ch] md:text-[2.1rem]">
            {title}
          </h1>
          <p className="max-w-[72ch] text-sm leading-6 text-[color:var(--ink-soft)]">
            {description}
          </p>
        </div>
        {actions ? (
          <div className="flex flex-wrap gap-2.5 border-t border-[color:var(--line)] pt-4 xl:border-t-0 xl:pt-0 md:gap-3">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SectionCard({
  eyebrow,
  title,
  chip,
  actions,
  children
}: Readonly<{
  eyebrow: string;
  title: string;
  chip?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <section className="panel-card fade-up rounded-[28px] p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-3 md:mb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.24em] text-[color:var(--brand)]">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-[1.45rem] leading-none md:text-[1.7rem]">{title}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {chip ? (
            <span className="inline-flex rounded-full border border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)] px-3 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--accent)]">
              {chip}
            </span>
          ) : null}
          {actions}
        </div>
      </div>

      {children}
    </section>
  );
}

export function EditableField({
  config,
  value,
  onChange
}: Readonly<{
  config: FieldConfig<string>;
  value: string;
  onChange: (value: string) => void;
}>) {
  return (
    <label className={`flex flex-col gap-2 ${config.full ? "md:col-span-2" : ""}`}>
      <span className="text-sm font-bold text-[color:var(--ink-soft)]">{config.label}</span>
      {config.multiline ? (
        <textarea
          rows={config.rows || 4}
          value={value}
          placeholder={config.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[112px] rounded-[22px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.92))] px-4 py-3 text-[color:var(--ink)] outline-none transition placeholder:text-black/35 focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[rgba(191,95,52,0.14)]"
        />
      ) : (
        <input
          type={config.type || "text"}
          value={value}
          placeholder={config.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 rounded-[22px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.92))] px-4 text-[color:var(--ink)] outline-none transition placeholder:text-black/35 focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[rgba(191,95,52,0.14)]"
        />
      )}
    </label>
  );
}

export function ActionButton({
  label,
  variant,
  onClick,
  disabled
}: Readonly<{
  label: string;
  variant: ButtonVariant;
  onClick: () => void;
  disabled?: boolean;
}>) {
  return (
    <button type="button" className={buttonClasses(variant)} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

export function LinkButton({
  href,
  label,
  variant
}: Readonly<{
  href: Route;
  label: string;
  variant: Exclude<ButtonVariant, "danger">;
}>) {
  return (
    <Link href={href} className={buttonClasses(variant)}>
      {label}
    </Link>
  );
}

export function EmptyState({ message }: Readonly<{ message: string }>) {
  return (
    <div className="rounded-[24px] border border-dashed border-[color:var(--line-strong)] bg-white/60 px-5 py-6 text-center text-sm leading-7 text-[color:var(--ink-soft)]">
      {message}
    </div>
  );
}

export function StatCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="panel-card rounded-[24px] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] p-4 md:p-5">
      <strong className="block text-[1.55rem] leading-none text-[color:var(--ink)] md:text-2xl">
        {value}
      </strong>
      <span className="mt-3 block text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[color:var(--ink-soft)] md:mt-6">
        {label}
      </span>
    </div>
  );
}

export function RegistryCard({
  active,
  title,
  chips,
  body,
  actions,
  onOpen
}: Readonly<{
  active: boolean;
  title: string;
  chips: string[];
  body: React.ReactNode;
  actions: Array<{
    label: string;
    variant: ButtonVariant;
    onClick: () => void;
  }>;
  onOpen: () => void;
}>) {
  return (
    <article
      className={`cursor-pointer rounded-[24px] border p-4 transition ${
        active
          ? "border-[rgba(191,95,52,0.45)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,246,240,0.95))] shadow-[0_20px_40px_rgba(191,95,52,0.08)]"
          : "border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(246,248,252,0.9))] hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(16,24,38,0.08)]"
      }`}
      onClick={onOpen}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <h3 className="truncate text-base font-extrabold text-[color:var(--ink)]">{title}</h3>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)] px-3 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[color:var(--accent)]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 space-y-1 text-sm leading-6 text-[color:var(--ink-soft)]">{body}</div>
        </div>

        <div className="flex flex-wrap gap-2 md:flex-col md:items-stretch">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={buttonClasses(action.variant)}
              onClick={(event) => {
                event.stopPropagation();
                action.onClick();
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
