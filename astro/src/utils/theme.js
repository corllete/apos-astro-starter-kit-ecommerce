export function formatPrice(price) {
  return parseFloat(price || 0).toFixed(2);
}

/**
 * Accepts global configuration array of navigation items and returns
 * normalized array of navigation items with active state.
 *
 * @param {{
 * urlType: string,
 *  _page?: { _url: string }[],
 * _category?: { _url: string }[],
 * _product?: { _url: string }[],
 * _file?: { _url: string }[],
 * }[]} nav
 * @param {string} [currentUrl]
 * @returns {{
 *  label: string,
 *  icon: string,
 *  urlType: string,
 *  url: string,
 *  active: boolean,
 * }[]}
 */
export function navItems(nav, currentUrl = "") {
  if (!Array.isArray(nav)) {
    return [];
  }
  const withUrl = nav.map((item) => {
    item = { ...item };
    switch (item.urlType) {
      case "page":
        item.url = item._page?.[0]?._url;
        break;
      case "category":
        item.url = item._category?.[0]?._url;
        break;
      case "product":
        item.url = item._product?.[0]?._url;
        break;
      case "file":
        item.url = item._file?.[0]?._url;
        break;
      case "custom":
      default:
        // Nothing to do, it's item.url already.
        break;
    }
    item.active = false;
    return item;
  });

  // Normalize currentUrl.
  if (typeof currentUrl !== "string") {
    return withUrl;
  }
  currentUrl = currentUrl?.split("?")[0];
  if (!currentUrl) {
    return withUrl;
  }
  let currentPath = currentUrl;
  if (!currentPath.startsWith("http")) {
    // Mock it for the URL constructor.
    currentPath = `http://localhost${currentPath}`;
  }
  const theUrl = new URL(currentPath);
  currentPath = theUrl.pathname;

  // Try exact matches first.
  let hasMatch = false;
  for (const item of withUrl) {
    if (!item.url) {
      continue;
    }
    if (getUrl(item).pathname === currentPath) {
      item.active = true;
      hasMatch = true;
      break;
    }
  }
  if (hasMatch) {
    return withUrl;
  }

  // Try partial matches.
  for (const item of withUrl) {
    if (!item.url) {
      continue;
    }
    const url = getUrl(item);
    if (theUrl.hostname !== url.hostname) {
      continue;
    }
    if (currentPath.startsWith(url.pathname)) {
      item.active = true;
      break;
    }
  }

  return withUrl;
}

export function maybeFilterEmptyCategories(categories, config) {
  if (!config?.hideEmptyCategories) {
    return categories;
  }
  return categories.filter(category => category._productCount > 0);
}

function getUrl(item) {
  return new URL(
    item.url?.startsWith("http")
      ? item.url
      : `${theUrl.protocol}//${theUrl.host}${item.url}`
  );
}
