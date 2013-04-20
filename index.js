module.exports = parse;

function parse(text) {
	var pieces = text.split(/\n/),
		results = {},
		lastKey = null;
	for (var i = 0; i < pieces.length; i++) {
		var piece = pieces[i] || '';
		if (piece == '---') {
			lastKey = null;
			continue;
		}
		var matches = piece.match(/(^[a-zA-Z0-9_]+)\:(?:[\s\n])*(.+|$)$/m);
		if (matches && matches.length == 3) {
			lastKey = matches[1];
			results[lastKey] = matches[2];
		} else {
			if (!lastKey) {
				if (results.content) {
					results.content += piece;
				} else {
					results.content = piece;
				}
			} else {
				results[lastKey] += (results[lastKey].length ? '\n' : '') + piece;
			}
		}
	}
	return results;
}