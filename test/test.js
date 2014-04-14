var chai = require('chai'),
	assert = chai.assert,
	should = chai.should,
	expect = chai.expect,
	path = require('path'),
	request = require('superagent');

var parsedown = require('../index');

function parseFile(file) {
	var text =  fs.readFileSync(file);
	return parsedown(text);
}

describe('Properties', function() {
	it('should convert lines starting with word+: to properties', function() {
		var param = parsedown('---\ntest:test test');
		expect(param.test).to.equal('test test');
		expect(param.content).equal('');
	});

	it('should put all text into content property if there are no properties present', function() {
		var param = parsedown('test test');
		expect(param.content).to.equal('test test');

		param = parsedown('test test\nmoreLines');
		expect(param.content).to.equal('test test\nmoreLines');

		param = parsedown('test test\nmoreLines\n--');
		expect(param.content).to.equal('test test\nmoreLines\n--');
	});

	it('should preserve linebreaks', function() {
		var param = parsedown('---\ntest:test test\ntest');
		expect(param.test).to.equal('test test\ntest');
	});

	it('should remove trailing linebreaks', function() {
		var param = parsedown('---\ntest: test test\n');
		expect(param.test).to.equal('test test');
	});

	it('should preserve double linebreaks', function() {
		var param = parsedown('---\ntest:test test\n\ntest');
		expect(param.test).to.equal('test test\n\ntest');
	});

	it('should ignore spaces in property keys', function() {
		var param = parsedown('te st:test');
		expect(param['te st']).to.be.undefined;
		expect(param.content).to.equal('te st:test');
	});

	it('should allow numbers in property keys', function() {
		var param = parsedown('---\ntest123:test');
		expect(param.test123).to.equal('test');
	});

	it('should allow underscores in property keys', function() {
		var param = parsedown('---\ntest_123:test');
		expect(param.test_123).to.equal('test');
	});

	it('should allow capital letters in property keys', function() {
		var param = parsedown('---\ncamelCase:test');
		expect(param.camelCase).to.equal('test');
	});

	it('should swallow line breaks after --- dividers', function() {
		var param = parsedown('---\n');
		expect(param.content).to.equal('');
	});

	it('should swallow multiple line breaks after --- dividers', function() {
		var param = parsedown('---\n\n');
		expect(param.content).to.equal('');
	});

	it('should swallow line breaks directly after a property name', function() {
		var param = parsedown('---\ntest:\ntest');
		expect(param.test).to.equal('test');
	});

	it('should swallow spaces directly after a property name', function() {
		var param = parsedown('---\ntest: testing');
		expect(param.test).to.equal('testing');

		param = parsedown('---\ntest:       testing');
		expect(param.test).to.equal('testing');
	});

	it('should swallow line-breaks & spaces directly after a property name', function() {
		var param = parsedown('---\ntest:       \n\ntesting');
		expect(param.test).to.equal('testing');
	});

	it('should ignore spaces in property keys', function() {
		var param = parsedown('---\n test:test\nsecond:value');
		expect(param['test']).to.be.undefined;
		expect(param['second']).to.equal('value');
	});

	it('lastKey should be nullified after --- divider, leading to next content without a property name to be placed inside content', function() {
		var param = parsedown('---\ntest:test\n---\nblabla');
		expect(param['test']).to.equal('test');
		expect(param.content).to.equal('blabla');
	});

	it('should only parse properties in the first --- block', function() {
		var param = parsedown('---\nfirst: value1\n---\nsecond:value2');
		expect(param.first).to.equal('value1');
		expect(param.content).to.equal('second:value2');

		param = parsedown('---\nfirst: value1\n---\nsecond:value2\n---\nsomemore');
		expect(param.first).to.equal('value1');
		expect(param.content).to.equal('second:value2\n---\nsomemore');
	});
	
});
