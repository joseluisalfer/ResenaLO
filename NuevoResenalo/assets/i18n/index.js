import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ca from './va/va.json'
import es from './es/es.json';
import en from './in/in.json';

const resources = {
    ca: { translation: ca },
    es: { translation: es },
    en: { translation: en },
};


i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'ca',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });
export default i18n;