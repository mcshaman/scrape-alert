import makeEmail from './makeEmail.js'
import log from './log.js'
import Results from './Results.js'

global.DB_FILE_PATH = './results.json'

/**
 * @param {import('./Results').Result} pResult
 * @returns
 */
function makeFormattedResult(pResult) {
	const { timestamp, message } = pResult

	return `${new Date(timestamp)} – ${message}`
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
		await email({
			subject: `📊 Scrape Alert: Results`,
			text: resultsData.map(makeFormattedResult).join('\n'),
		})
	} catch (pError) {
		log(`email failed to send - ${pError}`)

		return
	}

	if (purge) {
		await results.purge()
	}

	await results.write()
}
