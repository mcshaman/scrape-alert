import makeEmail from './makeEmail.js'
import log from './log.js'
import scrape from './scrape.js'
import Results from './Results.js'

global.DB_FILE_PATH = './results.json'

/**
 * @param {import('./scrape').Target[]} pTargets
 * @param {Object} pOptions
 * @param {string} pOptions.from
 * @param {string} pOptions.to
 * @param {string} [pOptions.smtpHost]
 * @param {number} [pOptions.smtpPort]
 * @param {string} [pOptions.smtpUser]
 * @param {string} [pOptions.smtpPass]
 * @param {string} [pOptions.synchronous]
 * @returns
 */
export default async function scrapeAlert(pTargets, pOptions) {
	const { from, to, smtpHost, smtpPort, smtpUser, smtpPass, synchronous } =
		pOptions

	const transportOptions = {
		host: smtpHost,
		port: smtpPort,
		auth: {
			user: smtpUser,
			pass: smtpPass,
		},
	}

	const transportDefault = {
		from,
		to,
	}

	const results = new Results()

	const email = await makeEmail(transportOptions, transportDefault)

	/** @type {import('./scrape.js').Options} */
	const scrapeOptions = {
		async onLoadPage(pContext) {
			const { name, url } = pContext

			try {
				await results.add(`The url ${url} failed to load`)
			} catch (pError) {
				log(`Failed to record result - ${pError}`, { prefix: name })
			}

			try {
				log(`sending email alerting load failure`, { prefix: name })

				await email({
					subject: `🛠 Scrape Alert: Couldn't load url for the '${name}' scraper`,
					text: `The url ${url} failed to load.`,
				})
			} catch (pError) {
				log(`email failed to send - ${pError}`, { prefix: name })
			}
		},
		async onNoMatch(pContext) {
			const { name, selector, url, screenshot } = pContext

			try {
				await results.add(
					`No matches for the CSS selector '${selector}' were found at ${url}. This could mean that the structure of the page has changed and the CSS selector may need to be modified.`
				)
			} catch (pError) {
				log(`Failed to record result - ${pError}`, { prefix: name })
			}

			try {
				log(`sending email alerting no elements matched`, {
					prefix: name,
				})

				await email({
					subject: `🛠 Scrape Alert: Couldn't find any elements for the '${name}' scraper`,
					text: `No matches for the CSS selector '${selector}' were found at ${url}. This could mean that the structure of the page has changed and the CSS selector may need to be modified.`,
					attachments: [
						{
							filename: 'screenshot.png',
							content: screenshot,
						},
					],
				})
			} catch (pError) {
				log(`email failed to send - ${pError}`, { prefix: name })
			}
		},
		async onMatch(pContext) {
			const { name, matchCount, url, screenshot } = pContext

			try {
				await results.add(`${matchCount} matches found at ${url}`)
			} catch (pError) {
				log(`Failed to record result - ${pError}`, { prefix: name })
			}

			try {
				log('sending email alerting elements matched', {
					prefix: name,
				})

				await email({
					subject: `⚠️ Scrape Alert: '${name}'`,
					text: `${matchCount} matches found at ${url}`,
					attachments: [
						{
							filename: 'screenshot.png',
							content: screenshot,
						},
					],
				})
			} catch (pError) {
				log(`email failed to send - ${pError}`, { prefix: name })
			}
		},
	}


	if (synchronous) {
		for (const target of pTargets) {
			await scrape(target, scrapeOptions)
		}
	} else {
		await Promise.all(pTargets.map((pTarget) => scrape(pTarget, scrapeOptions)))
	}

	await results.write()
}
