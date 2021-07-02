import meow from 'meow'
import scrape from './lib/scrape.js'

global.DB_FILE_PATH = './results.json'

const cli = meow(`
	Usage
	  $ scrape-alert config
`, {
	importMeta: import.meta,
	allowUnknownFlags: false,
})

const configPath = cli.input[0]

if (configPath) {
	import(configPath).then((module) => {
		const { targets, ...options } = module.default

		targets.forEach((pTarget) => scrape(pTarget, options))
	})
} else {
	cli.showHelp()
}
