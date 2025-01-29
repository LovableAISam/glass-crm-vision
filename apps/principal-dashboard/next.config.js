const withTM = require('next-transpile-modules')([
  '@woi/ui',
  '@woi/core',
  '@woi/common',
  '@woi/service',
  '@woi/web-component'
])
const { i18n } = require('./next-i18next.config');

module.exports = withTM({
  i18n,
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ['en', 'id'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  trailingSlash: true,
})
