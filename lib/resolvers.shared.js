'use strict';

var path = require('path');
var rc = require('./rc');

function getViewTemplatePath (action) {
  return path.resolve(rc.views, action);
}

module.exports = {
  getViewTemplatePath: getViewTemplatePath
};
