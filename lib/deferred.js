'use strict';

module.exports = function deferred (action, rules) {
  return rules.some(failed);
  function failed (challenge) {
    var left = challenge.split('/');
    var right = action.split('/');
    var lpart, rpart;
    while (left.length) {
      lpart = left.shift();
      rpart = right.shift();
      if (lpart !== '?' && lpart !== rpart) {
        return false;
      }
    }
    return true;
  }
};
