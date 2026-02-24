import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import ca from './ca/ca.json'
import es from './es/es.json';
import en from './en/en.json';
import zh from './zh/zh.json';  

/**
 * Resource mapping for supported languages.
 * Includes Catalan (ca), Spanish (es), English (en), and Chinese (zh).
 */
const resources = {
    ca: { translation: ca },
    es: { translation: es },
    en: { translation: en },
    zh: { translation: zh },  
};

i18n
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en',  // Initial language set to English
        fallbackLng: 'es', // Use Spanish if a translation is missing in the current language
        interpolation: {
            escapeValue: false, // React already protects against XSS
        },
    });

/**
 * Event listener for language changes.
 * This can be used for secondary actions like saving preferences to storage.
 */
i18n.on('languageChanged', (lng) => {
    // Logic for language change can be added here
});

export default i18n;