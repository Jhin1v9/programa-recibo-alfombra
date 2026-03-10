"use client";

type BrandMarkProps = {
  compact?: boolean;
  light?: boolean;
};

export function BrandMark({ compact = false, light = false }: Readonly<BrandMarkProps>) {
  const ring = light ? "stroke-white/16" : "stroke-slate-900/10";
  const accent = light ? "fill-amber-300" : "fill-[color:var(--brand)]";
  const main = light ? "fill-white" : "fill-slate-950";
  const soft = light ? "fill-white/72" : "fill-slate-500";
  const wordmark = light ? "text-white" : "text-[color:var(--ink)]";
  const submark = light ? "text-white/68" : "text-[color:var(--ink-soft)]";

  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "gap-4"}`}>
      <div
        className={`relative isolate overflow-hidden rounded-[20px] border ${
          light ? "border-white/12 bg-white/8" : "border-black/6 bg-white"
        } ${compact ? "h-12 w-12" : "h-14 w-14"}`}
      >
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="4.5" y="4.5" width="55" height="55" rx="16" className={ring} strokeWidth="1" />
          <path
            d="M19 20c0-2.2 1.8-4 4-4h18c2.2 0 4 1.8 4 4v20c0 2.2-1.8 4-4 4H23c-2.2 0-4-1.8-4-4V20Z"
            className={main}
          />
          <path
            d="M24 22.5h16c1.1 0 2 .9 2 2v11.5c0 1.1-.9 2-2 2H24c-1.1 0-2-.9-2-2V24.5c0-1.1.9-2 2-2Z"
            className={light ? "fill-slate-950" : "fill-white"}
          />
          <path
            d="M27 19.5c0-2 1.6-3.5 3.5-3.5h9c1.9 0 3.5 1.5 3.5 3.5v2.5H27v-2.5Z"
            className={accent}
          />
          <rect x="27" y="27" width="10" height="2.4" rx="1.2" className={soft} />
          <rect x="27" y="31.5" width="8" height="2.4" rx="1.2" className={soft} />
          <rect x="39.5" y="27" width="2.5" height="7" rx="1.25" className={accent} />
          <path
            d="M18 47h28"
            className={light ? "stroke-white/30" : "stroke-slate-300"}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M22 50.5h20"
            className={light ? "stroke-white/18" : "stroke-slate-200"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {compact ? null : (
        <div>
          <p className={`text-base font-extrabold tracking-[0.14em] uppercase ${wordmark}`}>
            Alfombra
          </p>
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${submark}`}>
            Receipt Studio
          </p>
        </div>
      )}
    </div>
  );
}
