import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'app.title': 'LocalBrain Enterprise',
      'chat.placeholder': 'Type a message or say "Hey Brain"...',
      'chat.send': 'Send',
      'terminal.new': 'New Terminal',
      'files.explorer': 'File Explorer',
      'settings.title': 'Settings',
      'settings.offline_mode': 'Offline Mode',
      'settings.theme': 'Theme',
      'settings.language': 'Language',
      'auth.login': 'Login',
      'auth.logout': 'Logout',
      'error.unknown': 'An unknown error occurred',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n };