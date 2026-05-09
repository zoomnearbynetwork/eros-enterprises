import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "radial-gradient(circle at top left, rgba(245, 199, 107, 0.26), transparent 30%), linear-gradient(180deg, #070708, #111214 60%, #17181b 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "84px",
              height: "84px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "28px",
              border: "1px solid rgba(245, 199, 107, 0.35)",
              background: "rgba(245, 199, 107, 0.12)",
              color: "#fde68a",
              fontSize: "30px",
              fontWeight: 700,
              letterSpacing: "0.2em",
            }}
          >
            EE
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "42px", fontWeight: 700 }}>
              {siteConfig.name}
            </div>
            <div
              style={{
                fontSize: "20px",
                opacity: 0.78,
                textTransform: "uppercase",
                letterSpacing: "0.28em",
              }}
            >
              Electrical + decorative lighting
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "62px",
              fontWeight: 700,
              lineHeight: 1.08,
              maxWidth: "960px",
            }}
          >
            Premium electrical infrastructure, lighting, and automation.
          </div>
          <div
            style={{
              fontSize: "28px",
              lineHeight: 1.45,
              opacity: 0.82,
              maxWidth: "920px",
            }}
          >
            Residential wiring, decorative lighting, smart automation, commercial
            execution, and AMC support.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
