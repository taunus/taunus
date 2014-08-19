# v0.4.0 High Seas

- Introduced public API method `.navigate(url)`

# v0.3.6 Route 66

- Added an optional `route` parameter for internal use

# v0.3.5 Contextual Tasting

- Fixed a bug where the initial `start` and `render` events would broadcast the wrong context

# v0.3.3 Logical Perplexion

- Fixed navigation when clicking links that don't match a route

# v0.3.2 Steady Navigation

- Fixed navigation when clicking links

# v0.3.1 Boob Flash

- `res.viewModel.action` allows you to change the view to be rendered
- If the request has a `.flash` method, then it'll get consumed when generating a response

# v0.3.0 Exposed Parts

- Expose partials on the core API in the client-side

# v0.1.10 Lock Picking

- Use `'` intead of `"` in auto-generated wiring

# v0.1.9 Word Smith

- Reworded standalone CLI usage

# v0.1.8 Bug Crusher

Fixes

- Fixed an issue with controllers not running on the client-side

# v0.1.7 Enviroment Activism

- Separated concerns in routing, templating, and controllers in the client-side

# v0.1.6 XML Vulnerability

- Added ability to intercept model requests and return a cached response before they server is queried

# v0.1.5 Packaging

- `.taunusrc` options can also be configured in `package.json`, as the `taunus` property

# v0.1.4 Emancipation

- `taunus --standalone taunus.js` eliminates dependency on Common.JS and Browserify

# v0.1.3 Spare Change

Fixes

- Fixed an issue when clicking on links

# v0.1.2 Town Car

- Turned into an event emitter
- Link click route-checking is delegated from `document.body`
- Implemented replaceable module path resolvers for customization

# v0.1.1 Saucy Studio

- Fixed a CLI issue forming paths on Windows

# v0.1.0 Fiery Pony

- Initial Public Release

