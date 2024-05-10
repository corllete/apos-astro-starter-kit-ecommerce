import _ from "lodash";

const self = {
  imageSizes: [
    {
      name: "max",
      width: 1600,
      height: 1600,
    },
    {
      name: "full",
      width: 1140,
      height: 1140,
    },
    {
      name: "two-thirds",
      width: 760,
      height: 760,
    },
    {
      name: "one-half",
      width: 570,
      height: 700,
    },
    {
      name: "one-third",
      width: 380,
      height: 700,
    },
    {
      name: "one-sixth",
      width: 190,
      height: 350,
    },
  ],
  fileGroups: [
    {
      name: "images",
      extensions: ["gif", "jpg", "png", "svg", "webp"],
      extensionMaps: { jpeg: "jpg" },
      image: true,
    },
    {
      name: "office",
      label: "apostrophe:office",
      extensions: [
        "txt",
        "rtf",
        "pdf",
        "xls",
        "ppt",
        "doc",
        "pptx",
        "sldx",
        "ppsx",
        "potx",
        "xlsx",
        "xltx",
        "csv",
        "docx",
        "dotx",
      ],
      extensionMaps: {},
      image: false,
    },
  ],
  croppable: {
    gif: true,
    jpg: true,
    png: true,
    webp: true,
  },
  sized: {
    gif: true,
    jpg: true,
    png: true,
    webp: true,
  },
};

/**
 * @typedef {object} AttachmentCrop
 * @property {number|null} top
 * @property {number|null} left
 * @property {number|null} width
 * @property {number|null} height
 * @property {number|null} [x]
 * @property {number|null} [y]
 *
 * @typedef  {'one-sixth' | 'one-third' | 'one-half' | 'two-thirds' | 'full' | 'original'} AttachmentSize
 */

/**
 * @typedef {object} Attachment
 * @property {string} _id
 * @property {string} name
 * @property {string} extension
 * @property {number} width
 * @property {number} height
 * @property {AttachmentCrop} [_crop]
 */

/**
 * @typedef {object} AttachmentOptions
 * @property {AttachmentSize} [size='full'] - The size of the image
 * @property {AttachmentCrop | false} [crop] - The crop of the image. If false, the crop is ignored.
 */

/**
 * Given an attachment object and optional options,
 * returns the URL of the attachment.
 *
 * @param {Attachment} attachment
 * @param {AttachmentOptions} [options]
 * @returns {string} The URL of the attachment
 */
function url(attachment, options = {}) {
  if (!attachment) {
    return "/modules/@apostrophecms/attachment/img/missing-icon.svg";
  }
  let path = attachment._id + "-" + attachment.name;
  let c;
  if (options.crop !== false) {
    c = options.crop || attachment._crop;
    if (c && c.width) {
      path += "." + c.left + "." + c.top + "." + c.width + "." + c.height;
    }
  }
  let effectiveSize;
  if (!isSized(attachment) || options.size === "original") {
    effectiveSize = false;
  } else {
    effectiveSize = options.size || "full";
  }
  if (effectiveSize) {
    path += "." + effectiveSize;
  }
  path += "." + attachment.extension;
  const basePath = attachment._urls?.original?.split("/").slice(0, -1) || '';
  return `${basePath.join('/')}/${path}`;
}

/**
 * Given an attachment object, returns the effective width of the attachment.
 *
 * @param {Attachment} attachment
 * @returns {number}
 */
function getWidth(attachment) {
  return attachment._crop ? attachment._crop.width : attachment.width;
}

/**
 * Given an attachment object, returns the effective height of the attachment.
 *
 * @param {Attachment} attachment
 * @returns {number}
 */
function getHeight(attachment) {
  return attachment._crop ? attachment._crop.height : attachment.height;
}

/**
 *
 * @param {Attachment} attachment
 * @returns {string} css `object-position` value
 */
function focalPointToObjectPosition(attachment) {
  if (!hasFocalPoint(attachment)) {
    return "center center";
  }
  const point = getFocalPoint(attachment);
  return `${point.x}% ${point.y}%`;
}

/**
 *
 * @param {Attachment} attachment
 * @returns {boolean}
 */
function hasFocalPoint(attachment) {
  if (!attachment) {
    return false;
  }
  if (typeof attachment.x === "number") {
    return true;
  }
  // Specified on a `_focalPoint` property hoisted via a join
  return typeof attachment._focalPoint?.x === "number";
}

/**
 *
 * @param {Attachment} attachment
 * @returns {{x: number, y: number} | null}
 */
function getFocalPoint(attachment) {
  if (!hasFocalPoint(attachment)) {
    return null;
  }

  if (typeof attachment._focalPoint?.x === "number") {
    return {
      x: attachment._focalPoint.x,
      y: attachment._focalPoint.y,
    };
  }
  return {
    x: attachment.x,
    y: attachment.y,
  };
}

/**
 * @param {Attachment} attachment
 * @returns {boolean}
 */
function isSized(attachment) {
  if (typeof attachment === "object") {
    return self.sized[resolveExtension(attachment.extension)];
  } else {
    return self.sized[resolveExtension(attachment)];
  }
}

/**
 * @param {Attachment} attachment
 * @returns {boolean}
 */
function isCroppable(attachment) {
  return (
    (attachment && self.croppable[resolveExtension(attachment.extension)]) ||
    false
  );
}

function allFactory(apos) {
  /**
   * Given an object and optional options, returns an array of all attachments.
   * @param {object} within - The object to search within
   * @param {{
   *  extension?: string,
   *  extensions?: string[],
   *  group?: string,
   *  annotate?: boolean
   * }} [options] - The options object
   */
  return function all(within, options = {}) {
    function test(attachment) {
      if (!attachment || typeof attachment !== "object") {
        return false;
      }
      if (attachment.type !== "attachment") {
        return false;
      }
      if (options.extension) {
        if (resolveExtension(attachment.extension) !== options.extension) {
          return false;
        }
      }
      if (options.group) {
        if (attachment.group !== options.group) {
          return false;
        }
      }
      if (
        options.extensions &&
        !options.extensions.includes(resolveExtension(attachment.extension))
      ) {
        return false;
      }
      return true;
    }
    const winners = [];
    if (!within) {
      return [];
    }
    apos.doc.walk(within, function (o, key, value, dotPath, ancestors) {
      if (test(value)) {
        if (o.credit) {
          value._credit = o.credit;
        }
        if (o.creditUrl) {
          value._creditUrl = o.creditUrl;
        }
        if (o.alt) {
          value._alt = o.alt;
        }

        value._isCroppable = isCroppable(value);

        o[key] = value;

        // If one of our ancestors has a relationship to the piece that
        // immediately contains us, provide that as the crop. This ensures
        // that cropping coordinates stored in an @apostrophecms/image widget
        // are passed through when we make a simple call to
        // apos.attachment.url with the returned object
        for (let i = ancestors.length - 1; i >= 0; i--) {
          const ancestor = ancestors[i];
          const ancestorFields =
            ancestor.attachment &&
            ancestor.attachment._id === value._id &&
            ancestor._fields;

          if (ancestorFields) {
            value = structuredClone(value);
            o.attachment = value;
            value._crop = ancestorFields.width
              ? _.pick(ancestorFields, "width", "height", "top", "left")
              : undefined;
            value._focalPoint =
              typeof ancestorFields.x === "number"
                ? _.pick(ancestorFields, "x", "y")
                : undefined;
            break;
          }
        }

        winners.push(value);
      }
    });
    return winners;
  };
}

function firstFactory(apos) {
  /**
   * Given an object and optional options, returns the first attachment.
   * @param {object} within - The object to search within
   * @param {{
   *  extension?: string,
   *  extensions?: string[],
   *  group?: string,
   *  annotate?: boolean
   * }} [options] - The options object
   * @returns {Attachment | undefined}
   */
  return function first(within, options = {}) {
    return apos.attachment.all(within, options)[0];
  };
}

function resolveExtension(extension) {
  const group = getFileGroup(extension);
  if (group) {
    return group.extensionMaps[extension] || extension;
  }
  return extension;
}

function getFileGroup(extension) {
  for (const group of Object.values(self.fileGroups)) {
    const candidate = group.extensionMaps[extension] || extension;
    if (group.extensions.includes(extension)) {
      return group;
    }
  }

  return null;
}

export default (apos) => {
  self.url = url;
  self.getWidth = getWidth;
  self.getHeight = getHeight;
  self.focalPointToObjectPosition = focalPointToObjectPosition;
  self.hasFocalPoint = hasFocalPoint;
  self.getFocalPoint = getFocalPoint;
  self.isSized = isSized;
  self.isCroppable = isCroppable;
  self.all = allFactory(apos);
  self.first = firstFactory(apos);

  return self;
};
