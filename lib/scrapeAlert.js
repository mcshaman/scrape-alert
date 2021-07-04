import makeEmail from './makeEmail.js'
import recordResult from './recordResult.js'
import log from './log.js'
import scrape from './scrape.js'

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
 * @returns
 */
export default async function scrapeAlert(pTargets, pOptions) {
	const { from, to, smtpHost, smtpPort, smtpUser, smtpPass } = pOptions

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

	const email = await makeEmail(transportOptions, transportDefault)

	return pTargets.forEach(async (pTarget) => {
		await scrape(pTarget, {
			onLoadPage: async (pContext) => {
				const { name, url } = pContext

				try {
					recordResult(`The url ${url} failed to load`)
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
			onNoMatch: async (pContext) => {
				const { name, selector, url, screenshot } = pContext

				try {
					recordResult(
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
			onMatch: async (pContext) => {
				const { name, matchCount, url, screenshot } = pContext

				try {
					recordResult(`${matchCount} matches found at ${url}`)
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
		})
	})
}
