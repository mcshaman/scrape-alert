import meow from 'meow'
import scrape from './lib/scrape.js'

const cli = meow(`
	Usage
	  $ scrape-alert config
`, {
	importMeta: import.meta,
})

const configPath = cli.input[0]

if (configPath) {
	import(configPath).then((module) => {
		const { targets, ...options } = module.default

		targets.forEach((pTarget) => scrape(pTarget, options))
	})
}
