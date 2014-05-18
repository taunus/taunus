'use strict';

var resolvers = module.exports = {
  use: use
};

function use (replacements) {
  Object.keys(replacements).forEach(replace);

  function replace (key) {
    if (key === 'use') { // sanity
      return;
    }
    resolvers[key] = replacements[key];
  }
}
