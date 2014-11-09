module.exports = function (path) {
  try {
    return module.parent.require(path);
  } catch (e) {
    return null;
  }
};
