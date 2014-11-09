'use strict';

var mount = require('./mount');
var render = require('./render');

module.exports = {
  mount: mount,
  render: render,
  rebuildDefaultViewModel: rebuildDefaultViewModel
};

function rebuildDefaultViewModel () {
  return mount.rebuildDefaultViewModel();
}
