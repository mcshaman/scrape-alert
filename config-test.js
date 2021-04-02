module.exports = {
	from: '"Foo" <foo@example.com>',
	to: '"Bar" <bar@example.com>',
	targets: [
		{
			name: 'Test Alert 1',
			url: 'http://example.com/',
			selector: 'h1',
			pattern: /example/i,
		},
		{
			name: 'Test Alert 2',
			url: 'http://example.fake.url.com/',
			selector: 'h1',
			pattern: /example/i,
		},
		{
			name: 'Test Alert 3',
			url: 'http://example.com/',
			selector: 'h1',
			pattern: /xylophone/i,
		},
		{
			name: 'Test Alert 4',
			url: 'http://example.com/',
			selector: 'h1',
		},
		{
			name: 'Test Alert 5',
			url: 'http://example.com/',
			selector: 'h2',
		},
		{
			name: 'Test Alert 6',
			url: 'http://example.com/',
			selector: async pPage => {
				await pPage.waitForSelector('h1')
				return await pPage.$$('h1')
			},
			pattern: /example/i,
		},
	],
}
