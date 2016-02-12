express-restify-mongoose-queryizer
==================================
Middleware for [express-restify-mongoose](https://florianholzapfel.github.io/express-restify-mongoose) which allows direct querying via GET without JSON structures.

The 2.0.0 release of ERM moved GET based querying into the `query` structure like this:

	http://myserver.com/api/widgets?query={"type":"foobar"}&sort=title

This middleware layer allows the old-style method of filtering directly within the GET request:

	http://myserver.com/api/widgets?type=foobar&sort=title

Meta fields and the existing `query` structure is still maintained allowing for compatibility with regular ERM query syntax.


Installation
------------
Install via NPM:

	npm --save install express-restify-mongoose-queryizer

Then somewhere in your express application install it as middleware:

	app.use(require('express-restify-mongoose-queryizer'));
