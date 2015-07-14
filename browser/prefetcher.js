'use strict';

var state = require('./state');
var router = require('./router');
var fetcher = require('./fetcher');
var activator = require('./activator');
var prefetcherIntent = require('./prefetcherIntent');
var jobs = [];
var intent;

function busy (url) {
  return jobs.indexOf(url) !== -1;
}

function start (url, element) {
  if (state.hardRedirect) {
    return; // no point in prefetching if location.href has changed
  }
  if (state.cache !== true) {
    return; // can't prefetch if caching is disabled
  }
  if (prefetcherIntent.is(null) === false) {
    return; // don't prefetch if the human wants to navigate: it'd abort the previous attempt
  }
  var route = router(url);
  if (route === null) {
    return; // only prefetch taunus view routes
  }
  if (busy(url)) {
    return; // already prefetching this url
  }

  global.DEBUG && global.DEBUG('[prefetcher] prefetching %s', route.url);
  jobs.push(url);
  fetcher(route, { element: element, source: 'prefetch' }, fetched);

  function fetched () {
    jobs.splice(jobs.indexOf(url), 1);
    if (prefetcherIntent.is(url)) {
      prefetcherIntent.abort();
      global.DEBUG && global.DEBUG('[prefetcher] resumed navigation for %s', route.url);
      activator.go(route.url, { context: element });
    }
  }
}

module.exports = {
  busy: busy,
  start: start
};
