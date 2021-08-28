#!/usr/bin/env node

import meow from 'meow'
import { join } from 'path'
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
	import(join(process.cwd(), configPath)).then((module) => {
		const { targets, ...options } = module.default

		scrapeAlert(targets, options)
	})
} else {
	cli.showHelp()
}
