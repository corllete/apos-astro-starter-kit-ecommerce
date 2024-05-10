import i18n, { setRequestConfig as setLocaleRequest } from "./apos/i18n";
import attachment from "./apos/attachment";
import image from "./apos/image";
import doc from "./apos/doc";
import asset, { setRequestConfig as setAssetRequest } from "./apos/asset";

const self = {};
self.i18n = i18n(self);
self.__t = self.i18n.translate;
self.asset = asset(self);
self.doc = doc(self);
self.attachment = attachment(self);
self.image = image(self);

export default self;

export function setRequestConfig(aposData = {}) {
  setAssetRequest(aposData);
  setLocaleRequest(aposData);

  return self;
};
