const self = {};

function walk(doc, iterator, _dotPath, _ancestors) {
  // We do not use lodash here because of
  // performance issues.
  //
  // Pruning big nested objects is not something we
  // can afford to do slowly. -Tom
  if (_dotPath !== undefined) {
    _dotPath += ".";
  } else {
    _dotPath = "";
  }
  _ancestors = (_ancestors || []).concat(doc);
  const remove = [];
  for (const key in doc) {
    const __dotPath = _dotPath + key.toString();
    const ow = "_originalWidgets";
    if (__dotPath === ow || __dotPath.substring(0, ow.length) === ow + ".") {
      continue;
    }
    if (iterator(doc, key, doc[key], __dotPath, _ancestors) === false) {
      remove.push(key);
    } else {
      const val = doc[key];
      if (typeof val === "object") {
        walk(val, iterator, __dotPath, _ancestors.concat([doc]));
      }
    }
  }
  for (const key of remove) {
    delete doc[key];
  }
}

export default (apos) => {
  self.walk = walk;

  return self;
};
