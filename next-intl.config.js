// Importing the locales from our i18n configuration
const {locales, defaultLocale} = require('./src/i18n');

module.exports = {
  // The locales that should be supported
  locales: ['en', 'zh', 'zh-Hant'],
  
  // The default locale that should be used when visiting
  // a non-locale prefixed path e.g. `/about`
  defaultLocale: 'en',

  localeDetection: true
}; 