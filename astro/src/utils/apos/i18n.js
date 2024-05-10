// Configure via the "astro-i18next" package, see `astro-i18next.config.mjs` 
// for more information.
import i18next from 'i18next';

const self = {};
self.translate = (key, options = {}) =>
  i18next.t(key, {
    ...options,
    lng: self.locale,
  });

export default (apos) => {
  return self;
};

export function setRequestConfig(aposData) {
  self.locale = aposData.locale;
}
