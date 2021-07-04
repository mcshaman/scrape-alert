import meow from 'meow'
import scrapeAlert from './lib/scrapeAlert.js'

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

		scrapeAlert(targets, options)
	})
} else {
	cli.showHelp()
}
