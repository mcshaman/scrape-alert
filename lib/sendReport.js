import makeEmail from './makeEmail.js'
import log from './log.js'
import Results from './Results.js'
import { stripIndent } from 'common-tags'

global.DB_FILE_PATH = './results.json'

/**
 * @param {number} pDate
 * @returns
 */
function makeFormattedDate(pDate) {
	return new Date(pDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * @param {import('./Results.js').Result} pResult
 * @returns
 */
 function makeFormattedResult(pResult) {
	const { error, timestamp, matchCount, target } = pResult
	const {name, url, selector, pattern} = target

	if (error) {

		return stripIndent`
			🛠 	${name} (${makeFormattedDate(timestamp)}) – ERROR

				No matches for the CSS selector were found found in the page. This could mean that the structure of the page has changed and the CSS selector may need to be modified.

				url: ${url}
				selector: ${selector}
				pattern: ${pattern}
		`
	}

	const matchesText = matchCount === 1 ? 'MATCH' : 'MATCHES'

	if (matchCount) {
		return stripIndent`
			⚠️ 	${name} (${makeFormattedDate(timestamp)}) – ${matchCount} ${matchesText}
		`
	}

	// No matches
	return stripIndent`
			💤 	${name} (${makeFormattedDate(timestamp)}) – ${matchCount} ${matchesText}
		`
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
			text: resultsData.map(makeFormattedResult).join('\n\n'),
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
