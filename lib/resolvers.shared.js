'use strict';

var path = require('path');
var rc = require('./rc');

function getView (action) {
  return path.resolve(rc.views, action);
}

module.exports = {
  getView: getView
};
