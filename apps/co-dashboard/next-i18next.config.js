const path = require('path');

module.exports = {
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id'],
  },
  localePath: path.resolve('../../packages/translation')
};
