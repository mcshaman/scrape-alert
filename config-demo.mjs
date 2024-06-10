export default {
	from: '"Foo" <foo@example.com>',
	to: '"Bar" <bar@example.com>',
	synchronous: false,
	targets: [
		{
			name: 'Demo Alert 1',
			url: 'http://example.com/',
			selector: 'h1',
			pattern: /example/i,
		},
		{
			name: 'Demo Alert 2',
			url: 'http://example.fake.url.com/',
			selector: 'h1',
			pattern: /example/i,
		},
		{
			name: 'Demo Alert 3',
			url: 'http://example.com/',
			selector: 'h1',
			pattern: /xylophone/i,
		},
		{
			name: 'Demo Alert 4',
			url: 'http://example.com/',
			selector: 'h1',
		},
		{
			name: 'Demo Alert 5',
			url: 'http://example.com/',
			selector: 'h2',
		},
		{
			name: 'Demo Alert 6',
			url: 'http://example.com/',
			selector: async pPage => {
				await pPage.waitForSelector('h1')
				return await pPage.$$('h1')
			},
			pattern: /example/i,
		},
	],
}
