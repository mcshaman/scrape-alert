import makeEmail from './makeEmail.js'
import getResults from './getResults.js'

global.DB_FILE_PATH = './results.json'

/**
 * @param {import('./getResults').Result} pResult
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
 * @returns
 */
export default async function sendReport(pOptions) {
	const { from, to, smtpHost, smtpPort, smtpUser, smtpPass } = pOptions;

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

	const email = await makeEmail('send-report', transportOptions, transportDefault)

	const results = await getResults()
	results.data ||= []

	email({
		subject: `📊 Scrape Alert: Results`,
		text: results.data.map(makeFormattedResult).join('\n'),
	})
}