const self = {};

function url(path) {
  return `${self.assetBaseUrl}${path}`;
}

export default (apos) => {
  self.url = url;
  return self;
};

export function setRequestConfig(aposData) {
  self.assetBaseUrl = aposData.aposBodyData?.assetBaseUrl || "";
}
