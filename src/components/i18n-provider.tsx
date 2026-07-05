"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { ReactNode, useEffect } from "react";

export default function I18nextProviderComponent({
  children,
}: {
  children: ReactNode;
}) {
  // Language detection runs after hydration so SSR (pt) and the first client
  // render match. Switching afterwards is a plain state update — no mismatch.
  useEffect(() => {
    const stored = localStorage.getItem("i18nextLng");
    const detected =
      stored || (navigator.language?.toLowerCase().startsWith("en") ? "en" : "pt");
    if (detected !== i18n.language) {
      i18n.changeLanguage(detected);
    }
    const persist = (lng: string) => localStorage.setItem("i18nextLng", lng);
    i18n.on("languageChanged", persist);
    return () => i18n.off("languageChanged", persist);
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
