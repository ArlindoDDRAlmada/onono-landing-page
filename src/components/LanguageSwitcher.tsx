"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
      <button
        onClick={() => changeLanguage("pt")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          i18n.language === "pt"
            ? "bg-gradient-to-r from-onono-cyan-500 to-onono-electric-500 text-white shadow-lg"
            : "text-gray-400 hover:text-white hover:bg-white/10"
        }`}
        suppressHydrationWarning={true}
      >
        PT
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          i18n.language === "en"
            ? "bg-gradient-to-r from-onono-cyan-500 to-onono-electric-500 text-white shadow-lg"
            : "text-gray-400 hover:text-white hover:bg-white/10"
        }`}
        suppressHydrationWarning={true}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
