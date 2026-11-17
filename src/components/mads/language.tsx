import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang, Pair } from "@/components/mads/copy";

type LanguageValue = {
  lang: Lang;
  toggle: () => void;
  t: (pair: Pair) => string;
};

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        toggle: () => setLang((current) => (current === "en" ? "it" : "en")),
        t: (pair) => pair[lang],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("LanguageProvider is missing");
  return value;
}
