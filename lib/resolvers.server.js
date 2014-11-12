'use strict';

var path = require('path');
var rc = require('./rc');

function getServerController (action) {
  return path.resolve(rc.server_controllers, action);
}

module.exports = {
  getServerController: getServerController
};
