module.exports = parse;

function parse(text) {
	var pieces = text.split(/\n/),
		results = {},
		content = '',
		lastKey = null,
		dividersSeen = 0;

	pieces.forEach(function (line) {
		if (line == '---' && dividersSeen < 2) {
			dividersSeen++;
		} else if (dividersSeen == 1) {
			var matches = line.match(/^(\w+?):\s*(.*)$/);
			if (matches && matches.length == 3) {
				lastKey = matches[1];
				results[lastKey] = matches[2];
			} else {
				results[lastKey] += '\n' + line;
			}
		} else {
			content += '\n' + line;
		}
	});

	results.content = content;

	for (var key in results) {
		// Trim whitespace, including linebreaks
		results[key] = results[key].replace(/^\s+|\s+$/g, '');
	}
	return results;
}
