import { ImageResponse } from "next/og";

export const alt = "Recibos Alfombra Studio";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0f172a 0%, #14213d 40%, #1f4b99 100%)",
          color: "#f8fafc",
          padding: "56px",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            borderRadius: "32px",
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.05)",
            padding: "42px 46px",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "36px",
                alignItems: "flex-start"
              }}
            >
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    width: "96px",
                    height: "96px",
                    borderRadius: "28px",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                    <rect x="12" y="14" width="40" height="34" rx="8" fill="#ffffff" />
                    <path d="M24 11.5C24 9.01472 26.0147 7 28.5 7H35.5C37.9853 7 40 9.01472 40 11.5V16H24V11.5Z" fill="#4cc9f0" />
                    <rect x="20" y="23" width="16" height="3" rx="1.5" fill="#475569" />
                    <rect x="20" y="29" width="12" height="3" rx="1.5" fill="#475569" />
                    <rect x="39" y="23" width="5" height="10" rx="2.5" fill="#4cc9f0" />
                    <path d="M17 53H47" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                    <path d="M22 58H42" stroke="#ffffff" strokeOpacity=".45" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div
                    style={{
                      fontSize: "22px",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "#7dd3fc",
                      fontWeight: 700
                    }}
                  >
                    Recibos Alfombra Studio
                  </div>
                  <div style={{ fontSize: "48px", lineHeight: 1.02, fontWeight: 800, maxWidth: "560px" }}>
                    Resguardos de recogida para limpieza profesional
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  minWidth: "280px",
                  padding: "24px",
                  borderRadius: "24px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)"
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#bfdbfe",
                    fontWeight: 700
                  }}
                >
                  Flujo central
                </div>
                <div style={{ fontSize: "26px", lineHeight: 1.2, fontWeight: 700 }}>
                  Clientes, recogida, custodia temporal, entrega y PDF A4
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                alignItems: "flex-end"
              }}
            >
              <div style={{ display: "flex", gap: "16px" }}>
                {["Agenda de clientes", "Recibos A4", "Entrega y conformidad"].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      padding: "14px 20px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      fontSize: "22px",
                      fontWeight: 700
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "24px", color: "#cbd5e1" }}>
                Programa web listo para Vercel
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
