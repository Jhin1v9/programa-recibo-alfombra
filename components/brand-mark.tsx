"use client";

type BrandMarkProps = {
  compact?: boolean;
  light?: boolean;
};

export function BrandMark({ compact = false, light = false }: Readonly<BrandMarkProps>) {
  const ring = light ? "rgba(255, 255, 255, 0.16)" : "rgba(15, 23, 42, 0.1)";
  const accent = light ? "#fcd34d" : "#c36a39";
  const main = light ? "#ffffff" : "#020617";
  const inner = light ? "#0f172a" : "#ffffff";
  const soft = light ? "rgba(255, 255, 255, 0.72)" : "#64748b";
  const line = light ? "rgba(255, 255, 255, 0.3)" : "#cbd5e1";
  const softLine = light ? "rgba(255, 255, 255, 0.18)" : "#e2e8f0";
  const wordmark = light ? "#ffffff" : "var(--ink)";
  const submark = light ? "rgba(255, 255, 255, 0.68)" : "var(--ink-soft)";

  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "gap-4"}`}>
      <div
        className={`relative isolate overflow-hidden rounded-[20px] ${compact ? "h-12 w-12" : "h-14 w-14"}`}
        style={{
          border: light ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.06)",
          background: light ? "rgba(255, 255, 255, 0.08)" : "#ffffff"
        }}
      >
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="4.5" y="4.5" width="55" height="55" rx="16" fill="none" stroke={ring} strokeWidth="1" />
          <path
            d="M19 20c0-2.2 1.8-4 4-4h18c2.2 0 4 1.8 4 4v20c0 2.2-1.8 4-4 4H23c-2.2 0-4-1.8-4-4V20Z"
            fill={main}
          />
          <path
            d="M24 22.5h16c1.1 0 2 .9 2 2v11.5c0 1.1-.9 2-2 2H24c-1.1 0-2-.9-2-2V24.5c0-1.1.9-2 2-2Z"
            fill={inner}
          />
          <path
            d="M27 19.5c0-2 1.6-3.5 3.5-3.5h9c1.9 0 3.5 1.5 3.5 3.5v2.5H27v-2.5Z"
            fill={accent}
          />
          <rect x="27" y="27" width="10" height="2.4" rx="1.2" fill={soft} />
          <rect x="27" y="31.5" width="8" height="2.4" rx="1.2" fill={soft} />
          <rect x="39.5" y="27" width="2.5" height="7" rx="1.25" fill={accent} />
          <path
            d="M18 47h28"
            stroke={line}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M22 50.5h20"
            stroke={softLine}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {compact ? null : (
        <div>
          <p className="text-base font-extrabold uppercase tracking-[0.14em]" style={{ color: wordmark }}>
            Alfombra
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: submark }}>
            Receipt Studio
          </p>
        </div>
      )}
    </div>
  );
}
