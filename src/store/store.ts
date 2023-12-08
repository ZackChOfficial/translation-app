import { create } from "zustand";
import { Subscription } from "@/types/Subscription";

export type LanguagesSupported = "en" | "es" | "de" | "fr" | "ar" | "hi" | "zh" | "ru" | "nl";


export type Optional<T> = T | null | undefined;

export const LanguagesSupportedMap: Record<LanguagesSupported, string> = {
    en: "English",
    es: "Spanish",
    de: "German",
    fr: "French",
    ar: "Arabic",
    hi: "Hindi",
    zh: "Chinese (Simplified)",
    ru: "Russian",
    nl: "Dutch"
};

interface LanguageState {
    language: LanguagesSupported;
    setLanguage: (language: LanguagesSupported) => void;
    getLanguages: (isPro: boolean) => LanguagesSupported[];
    getNotSupportedLanguages: (isPro: boolean) => LanguagesSupported[];
}

interface SubscriptionState {
    subscription: Optional<Subscription>;
    setSubscription: (subscription: Subscription | null) => void,
}

export const useSubscription = create<SubscriptionState>((set) => ({
    subscription: undefined,
    setSubscription: (subscription: Subscription | null) => set({ subscription })
}))

export const useLanguageStore = create<LanguageState>((set, get) => ({
    language: 'en',
    setLanguage: (language: LanguagesSupported) => set({language}),
    getLanguages: (isPro: boolean) => {
        if (isPro)
            return Object.keys(LanguagesSupportedMap) as LanguagesSupported[];

        return Object.keys(LanguagesSupportedMap).slice(0, 2) as LanguagesSupported[];
    },
    getNotSupportedLanguages: (isPro: boolean) => {
        if (isPro) return [];
        return Object.keys(LanguagesSupportedMap).slice(2) as LanguagesSupported[];
    }
}))