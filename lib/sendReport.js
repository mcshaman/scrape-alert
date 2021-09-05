import makeEmail from './makeEmail.js'
import log from './log.js'
import Results from './Results.js'

global.DB_FILE_PATH = './results.json'

/**
 * @param {import('./Results').Result} pResult
 * @returns
 */
function makeMessage(pResult) {
	const { error, matchCount, target } = pResult

	if (error) {
		return `The url ${target.url} failed to load`
	}

	if (matchCount) {
		return `${matchCount} matches found at ${target.url}`
	}

	// No matches
	return `No matches for the CSS selector '${target.selector}' were found at ${target.url}. This could mean that the structure of the page has changed and the CSS selector may need to be modified.`
}

/**
 * @param {import('./Results').Result} pResult
 * @returns
 */
function makeFormattedResult(pResult) {
	return `${new Date(pResult.timestamp)} – ${makeMessage(pResult)}`
}

/**
 * @param {Object} pOptions
 * @param {string} pOptions.from
 * @param {string} pOptions.to
 * @param {string} [pOptions.smtpHost]
 * @param {number} [pOptions.smtpPort]
 * @param {string} [pOptions.smtpUser]
 * @param {string} [pOptions.smtpPass]
 * @param {boolean} [pOptions.purge]
 * @returns
 */
export default async function sendReport(pOptions) {
	const { from, to, smtpHost, smtpPort, smtpUser, smtpPass, purge } = pOptions

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

	const resultsData = await results.getData()

	try {
		log('sending results email')

		await email({
			subject: `📊 Scrape Alert: Results`,
			text: resultsData.map(makeFormattedResult).join('\n'),
		})
	} catch (pError) {
		log(`email failed to send - ${pError}`)

		return
	}

	if (purge) {
		log('purging results')

		await results.purge()

		try {
			await results.write()
		} catch (pError) {
			log(`failed to purge results - ${pError}`)
		}
	}
}
