'use strict';

var Route = require('./Route');

function router (url) {
  return null;
}

function setup (routes) {
  // routes..
  // { controller, template, fetch, match }
}

router.setup = setup;

module.exports = router;
/*
    function getRoute(url){
      if(url === undefined){
        return {};
      }

      var result = {
        key: stringKeys[url]
      };

      if(result.key !== undefined){
        return result;
      }

      $.each(regexKeys, function() {
        var self = this,
          captures = url.match(self.regex);
        if (captures !== null){
          result = {
            key: self.key,
            settings: {
              key: self.alias.key,
              data: self.alias.route.map(captures)
            }
          };
          return false;
        }
      });
      return result;
    }
*/
