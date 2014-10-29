# v1.8.0 Defer All The Things

- Model is now expected to load asynchronously via `taunusReady` global

# v1.7.6 Refund

- Requesting a new page provokes Taunus to `.abort` the request currently being made

# v1.7.5 Dependency Hoarder

- Removed dependency on `lodash.unescape`

# v1.7.3 Cache Driver

- A `max-age=0` header prevents stale content from never being refreshed

# v1.7.2 Cache Driver

- Changed `max-age` to only 1 hour

# v1.7.1 Slave Driver

- Add ability to rebuild default view model at a later point in time

# v1.6.21 Early Bird

Wait for `defaults` to become available before serving any responses

# v1.6.20 Negotiator

- Use `accepts` for content negotiation

# v1.6.19 Hollow Point

- Fixed an issue when navigating to hashes

# v1.6.8 Cat Food

- Fixed an issue with links being reloaded
- Fixed an issue when navigating backwards

# v1.6.4 Crash Course

- Changed caching model to `private, must-revalidate`, and set `max-age` to a day

# v1.6.3 Golf Cart

- Default view model no longer request-based, more memory efficient

# v1.5.1 Cache Negotiation

- Use a different URL when hijacking AJAX requests so that browsers properly cache JSON vs HTML

# v1.5.0 Cache Machine

- Introduced server-side view caching, setting `ETag`, `Vary`, and `cache-control` HTTP headers

# v1.4.10 Ancient Browsing

- Fix a bug where old browsers would change the `location.href` and execute AJAX code afterwards
- Fix a bug where `ignore` wouldn't be propagated by the CLI to client-side routes

# v1.4.8 Hollow Point

- Anchor links containing `<span>` or any other child elements that may be event targets now get hijacked as well

# v1.4.7 Sleepy Hollow

- Print the stack trace of captured template rendering errors

# v1.4.6 Skeptic Magician

- Fix a bug in browsers without history API
- Prevent `.mount` to be called more than once in the client-side
- Friendly error message if view rendering fails

# v1.4.5 Shy Shoulder

- Fix a bug where links wouldn't be ajax-enhanced

# v1.4.4 Sankara Stones

- Introduced `skip` to skip over view routes in certain situations

# v1.4.3 Dividing Line

- Added `ignore` option to allow routes that go straight to the server

# v1.4.2 Fancy Treat

- Introduced ability to set response status code in model

# v1.4.0 Responsive Design

- Implemented public API method that allows generating a response using the Taunus API

# v1.3.0 Ion Drive

- Browser support when `history` API is missing

# v1.2.2 Switcheroo

- Moved around arguments for `'error'` event

# v1.1.1 Silent Killer

- Event emitter no longer throws on errors

# v1.1.0 Renderist

- Renders views using `function(model)` on the server-side as well

# v1.0.6 Anchor Fighters

- Play nice on links with `href='#...'`

# v1.0.3 Rafael

- Fixed a missing reference to `raf`

# v1.0.2 Broken Promises

- Taunus now expects `data-taunus` attributes to match a `<script>` tag containing the view model

# v0.5.5 Backwards Compatibility

- Navigating through history properly triggers the corresponding scroll towards the route hash, or the top of the document

# v0.5.4 Logic Route

- Improved routing logic so that it remembers `search` and `hash` parts of a URL, while these won't factor into routing itself

# v0.5.3 Model of the State

- `taunus.state.model` now exposes the current view's model

# v0.5.2 Wary Goblin

- Introduced middleware option to modify base view model on a request basis

# v0.5.1 State of the Art

- Publish `state` on public API

# v0.4.5 Honorary Title

- Fix a bug when navigating backwards where the `document.title` wouldn't be updated

# v0.4.4 Brokeback Mountain

- Fix a bug when navigating backwards to a view that re-routed the action through `model.action`

# v0.4.3 User Matters

- `req.user` is automatically copied into `model.user`

# v0.4.2 Foo Fighters

- Relative paths for convenience

# v0.4.1 Action Figure

- Ability to change the default action through a property in the model

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

