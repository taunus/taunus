'use strict';

var mount = require('./mount');
var render = require('./render');
var resolve = require('./resolve');
var redirect = require('./redirect');

module.exports = {
  mount: mount,
  render: render,
  resolve: resolve,
  redirect: redirect,
  rebuildDefaultViewModel: rebuildDefaultViewModel
};

function rebuildDefaultViewModel (done) {
  if (!mount.rebuildDefaultViewModel) {
    throw new Error('You need to mount Taunus before using rebuildDefaultViewModel!');
  }
  mount.rebuildDefaultViewModel(done);
}
