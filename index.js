var _ = require('lodash');
var hson = require('hanson');

module.exports = function(settings) {
	_.defaults(settings, {
		rewriteQuery: true,
		rewriteQueryDeleteKeys: false,
		rewriteGetOnly: true,
		rewriteParseJSON: true,
		rewriteParseHSON: true,
		postToPatch: true,
		postToPatchUrl: /^\/api\/.+\/[0-9a-f]{24}$/,
	});

	return function(req, res, next) {
		if (
			settings.rewriteQuery &&
			(
				!settings.rewriteGetOnly ||
				req.method == 'GET'
			)
		) {
			// Import existing query structure if its present
			var newQuery = req.query.query ? JSON.parse(req.query.query) : {};

			Object.keys(req.query).forEach(function(key) {
				if (key == 'query') return; // Ignore the existing query structure
				if (key == 'distinct' || key == 'limit' || key == 'populate' || key == 'select' || key == 'skip' || key== 'sort') return; // Ignore meta fields
				if (settings.rewriteParseJSON && _.startsWith(req.query[key], '{') && _.endsWith(req.query[key], '}')) { // Looks like JSON (yes i know this is a stupid test but it works for now)
					if (settings.rewriteParseHSON) {
						newQuery[key] = hson.parse(req.query[key]);
					} else {
						newQuery[key] = JSON.parse(req.query[key]);
					}
				} else {
					newQuery[key] = req.query[key];
				}

				if (settings.rewriteQueryDeleteKeys) delete req.query[key];
			});

			// Encode back into req.query.query
			req.query.query = JSON.stringify(newQuery);
		}

		if (
			settings.postToPatch &&
			req.method == 'POST' &&
			( !settings.postToPatchUrl || settings.postToPatchUrl.test(req.originalUrl) )
		) {
			req.method = 'PATCH';
		}

		next();
	};

};
