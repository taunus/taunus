# ponymoo

> Micro MVC engine

`ponymoo` aims to simplify the state of MVC and shared rendering.

# `.boot(elem, routes)`

In `ponymoo`, everything starts at `boot`.

- `root` Element where partials will get rendered. e.g: `document.getElementByID('main')`
- `routes` An array of route definitions, as explained below

```js
ponymoo.boot(root, routes);
```

The `root` element is expected to have a `data-ponymoo` attribute whose value is the model that was used by the server to render the partial view the first time around. This model will be parsed and passed to the view controller during the boot process.

# Route Definitions

Route definitions have a few properties.

```
{
  route: '/author/compose',
  template: function (model) {
    return '<h1>' + model.title + '</h1>';
  },
  controller: function (model) {
    // controller code
  }
}
```

- `route` is passed to [`routes`][1] directly, and used to match the URL to a view controller
- `template` is expected to be a function, and it'll be passed a `model` object
- `controller` is invoked after the template is rendered, allowing you to bind event listeners and the like

When the application boots for the first time, `ponymoo` will find the route that matches `location.pathname`, and execute its controller. The first time around, the server-side is expected to render the partial view template. From that point on, `ponymoo` will take over rendering templates in the client-side. You should've set the initial model properly as well, as explained in `ponymoo.boot`.

# Links

Links on every partial are analyzed and 

# License

MIT

[1]: https://github.com/aaronblohowiak/routes.js "connect's minimalist routing module"
