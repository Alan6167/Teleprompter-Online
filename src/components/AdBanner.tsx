"use client";

import { useEffect, useRef, useState } from "react";

const labels: Record<string, string> = {
  en: "Advertisement", es: "Publicidad", pt: "Publicidade", fr: "Publicité",
  de: "Werbung", it: "Pubblicità", ru: "Реклама",
};

/** Keep third-party advertising isolated from scripts, settings and tool inputs. */
export function AdBanner({ locale }: { locale: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(320);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const privacy = navigator as Navigator & { globalPrivacyControl?: boolean };
    setEnabled(navigator.doNotTrack !== "1" && !privacy.globalPrivacyControl);
    function resize(event: MessageEvent) {
      if (event.source !== frame.current?.contentWindow || event.data?.type !== "native-ad-size") return;
      const value = event.data.height;
      if (typeof value === "number" && Number.isFinite(value)) {
        setHeight(value < 40 ? 0 : Math.min(1800, Math.ceil(value)));
      }
    }
    window.addEventListener("message", resize);
    return () => window.removeEventListener("message", resize);
  }, []);

  if (!enabled) return null;
  const label = labels[locale] ?? labels.en;
  return (
    <aside aria-label={label} className={`mx-auto w-full max-w-6xl px-4 ${height ? "my-8" : ""}`}>
      {height > 0 && <p className="mb-2 text-center text-xs opacity-60">{label}</p>}
      <iframe
        ref={frame}
        src="/ads/native.html"
        title={label}
        loading="lazy"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ display: "block", width: "100%", height, border: 0, background: "#fff", borderRadius: 8 }}
      />
    </aside>
  );
}
