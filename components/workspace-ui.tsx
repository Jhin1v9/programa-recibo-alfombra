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
    return `${base} bg-[linear-gradient(135deg,#101826_0%,#22304d_100%)] text-white shadow-[0_18px_34px_rgba(16,24,38,0.18)] hover:-translate-y-0.5`;
  }

  if (variant === "secondary") {
    return `${base} bg-[linear-gradient(135deg,var(--brand)_0%,var(--brand-deep)_100%)] text-white shadow-[0_18px_34px_rgba(191,95,52,0.18)] hover:-translate-y-0.5`;
  }

  if (variant === "danger") {
    return `${base} bg-[rgba(163,49,49,0.1)] text-[color:var(--danger)] hover:-translate-y-0.5`;
  }

  return `${base} bg-black/[0.05] text-[color:var(--ink)] hover:-translate-y-0.5`;
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
    <section className="hero-card fade-up overflow-hidden rounded-[30px] border border-white/10 p-6 text-white">
      <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.28em] text-amber-200/80">
        {eyebrow}
      </p>
      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <h1 className="max-w-[16ch] text-4xl leading-none md:text-[3rem]">{title}</h1>
          <p className="max-w-[54ch] text-sm leading-7 text-white/78">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
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
    <section className="panel-card fade-up rounded-[30px] p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.24em] text-[color:var(--brand)]">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl leading-none">{title}</h2>
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
          className="min-h-[112px] rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-3 text-[color:var(--ink)] outline-none transition placeholder:text-black/35 focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[rgba(191,95,52,0.14)]"
        />
      ) : (
        <input
          type={config.type || "text"}
          value={value}
          placeholder={config.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 text-[color:var(--ink)] outline-none transition placeholder:text-black/35 focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[rgba(191,95,52,0.14)]"
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
    <div className="panel-card rounded-[26px] p-5">
      <strong className="block text-2xl text-[color:var(--ink)]">{value}</strong>
      <span className="mt-6 block text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
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
          ? "border-[rgba(191,95,52,0.55)] bg-[rgba(255,255,255,0.86)] shadow-[inset_0_0_0_1px_rgba(191,95,52,0.2)]"
          : "border-[color:var(--line)] bg-[color:var(--surface-strong)] hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(16,24,38,0.08)]"
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
