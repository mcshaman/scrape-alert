module.exports = {
	from: '"Foo" <foo@example.com>',
	to: '"Bar" <bar@example.com>',
	targets: [
		{
			name: 'Test Alert',
			url: 'http://example.com/',
			selector: 'h1',
			pattern: /example/i,
		},
	],
}
