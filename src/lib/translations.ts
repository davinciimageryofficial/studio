
import type { Language } from "@/context/language-context";

// Other languages can be added as json files in the locales directory.
// We provide a default minimal english object to prevent errors on initial load.
const en = {
    "settings": "Settings",
    "manageAccount": "Manage your account and application preferences.",
    "profile": "Profile",
    "updateProfile": "Update your public profile information."
};

export const translations = { en };

export const getTranslations = async (language: Language) => {
    try {
        // Dynamically import the language file.
        const langModule = await import(`@/lib/locales/${language}.json`);
        return langModule.default;
    } catch (error) {
        console.warn(`Could not load translations for "${language}", falling back to English.`);
        // Fallback to English by importing it directly if the dynamic one fails
        const enModule = await import(`@/lib/locales/en.json`);
        return enModule.default;
    }
};
