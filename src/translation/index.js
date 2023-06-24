import resources from './resources';
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18next from "i18next";

const config = {
  interpolation: { escapeValue: false }, // React already does escaping
  lng: 'en',
  resources,
  react: { useSuspense: false }
};

i18next.use(initReactI18next).init(config);

export default i18next;

export { resources };
