const self = {};

function srcsetFactory(apos) {
  /**
   * @param {import('./attachment').Attachment} attachment
   * @param {import('./attachment').AttachmentCrop} cropFields
   * @returns {string} srcset attribute value
   */
  return function srcset(attachment, cropFields) {
    if (!apos.attachment.isSized(attachment)) {
      return "";
    }
    // Since images are never scaled up once uploaded, we only need to
    // include a single image size that's larger than the original image
    // (if such an image size exists) to cover as many bases as possible
    let includedOriginalWidth = false;
    const sources = apos.attachment.imageSizes
      .filter(function (imageSize) {
        if (imageSize.width < attachment.width) {
          return true;
        } else if (!includedOriginalWidth) {
          includedOriginalWidth = true;
          return true;
        }

        return false;
      })
      .map(function (imageSize) {
        const src = apos.attachment.url(attachment, {
          size: imageSize.name,
          crop: cropFields,
        });
        const width = Math.min(imageSize.width, attachment.width);
        return src + " " + width + "w";
      });
    return sources.join(", ");
  };
}

function firstFactory(apos) {
  return function first(within, options = {}) {
    return apos.attachment.first(within, {
      ...options,
      group: "images",
    });
  };
}

function allFactory(apos) {
  return function all(within, options = {}) {
    return apos.attachment.all(within, {
      ...options,
      group: "images",
    });
  };
}

export default (apos) => {
  self.srcset = srcsetFactory(apos);
  self.first = firstFactory(apos);
  self.all = allFactory(apos);

  return self;
};
