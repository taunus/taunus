'use strict';

var state = require('./state');
var router = require('./router');
var fetcher = require('./fetcher');
var activator = require('./activator');
var jobs = [];
var intent;

function busy (url) {
  return jobs.indexOf(url) !== -1;
}

function registerIntent (url) {
  intent = url;
}

function abortIntent (url) {
  intent = null;
}

function start (url, element) {
  if (state.cache !== true) { // can't prefetch if caching is disabled
    return;
  }
  if (intent) { // don't prefetch if the human wants to navigate: it'd abort the previous attempt
    return;
  }
  var route = router(url);
  if (route === null) { // only prefetch taunus view routes
    return;
  }
  if (busy(url)) { // already prefetching this url
    return;
  }

  global.DEBUG && global.DEBUG('[prefetcher] prefetching %s', route.url);
  jobs.push(url);
  fetcher(route, { element: element, source: 'prefetch' }, fetched);

  function fetched () {
    jobs.splice(jobs.indexOf(url), 1);
    if (intent === url) {
      intent = null;

      global.DEBUG && global.DEBUG('[prefetcher] resumed navigation for %s', route.url);
      activator.go(route.url, { context: element });
    }
  }
}

module.exports = {
  busy: busy,
  start: start,
  registerIntent: registerIntent,
  abortIntent: abortIntent
};
