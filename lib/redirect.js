'use strict';

var render = require('./render');

function noop () {}

module.exports = function (req, res, url, options) {
  var o = options || {};
  var data = {
    redirect: {
      href: url, hard: o.hard === true, force: o.force === true
    }
  };
  render({}, data, req, res, noop);
};
