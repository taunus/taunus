'use strict';

var g = global;

// fallback to empty object because tests
module.exports = g.indexedDB || g.mozIndexedDB || g.webkitIndexedDB || g.msIndexedDB || {};
