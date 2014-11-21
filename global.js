'use strict';

var taunus = global.taunus;
if (taunus === void 0) {
  throw new Error('You must require(\'taunus\') earlier, when setting up the mountpoint!');
}

module.exports = taunus;
