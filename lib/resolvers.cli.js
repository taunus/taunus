'use strict';

var path = require('path');
var rc = require('./rc');

function getViewControllerPath (action) {
  return path.resolve(rc.client_controllers, action);
}

module.exports = {
  getViewControllerPath: getViewControllerPath
};
