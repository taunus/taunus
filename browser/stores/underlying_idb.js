'use strict';

var g = global;

module.exports = g.indexedDB || g.mozIndexedDB || g.webkitIndexedDB || g.msIndexedDB;
