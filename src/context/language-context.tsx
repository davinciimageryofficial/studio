
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTranslations, translations as defaultTranslations } from '@/lib/translations';

// Defines the available languages. Add new language codes here.
export const availableLanguages = ['en', 'es', 'zh', 'hi', 'fr'];
export type Language = typeof availableLanguages[number];


interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: typeof defaultTranslations['en'];
  isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState(defaultTranslations.en);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadTranslations = useCallback(async (lang: Language) => {
    // Set loading state to false only after attempting to load translations.
    try {
      const newTranslations = await getTranslations(lang);
      setTranslations(newTranslations);
    } catch (e) {
      console.error(`Could not load translations for ${lang}, falling back to English.`);
      setTranslations(defaultTranslations.en);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // We start with isLoaded as false.
    setIsLoaded(false);
    const savedLanguage = localStorage.getItem('sentry-language') as Language | null;
    const initialLang = (savedLanguage && availableLanguages.includes(savedLanguage)) ? savedLanguage : 'en';
    setLanguage(initialLang);
    loadTranslations(initialLang);
  }, [loadTranslations]);

  const handleSetLanguage = (lang: Language) => {
    setIsLoaded(false);
    setLanguage(lang);
    localStorage.setItem('sentry-language', lang);
    loadTranslations(lang);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    translations,
    isLoaded
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

    