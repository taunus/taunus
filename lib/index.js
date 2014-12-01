'use strict';

var mount = require('./mount');
var render = require('./render');
var resolve = require('./resolve');

module.exports = {
  mount: mount,
  render: render,
  resolve: resolve,
  rebuildDefaultViewModel: rebuildDefaultViewModel
};

function rebuildDefaultViewModel (done) {
  if (!mount.rebuildDefaultViewModel) {
    throw new Error('You need to mount Taunus before using rebuildDefaultViewModel!');
  }
  mount.rebuildDefaultViewModel(done);
}
