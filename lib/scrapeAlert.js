import puppeteer from 'puppeteer'
import querySelectorAll from './querySelectorAll.js'
import isElementMatch from './isElementMatch.js'
import filterAsync from './filterAsync.js'
import log from './log.js'
import makeEmail from './makeEmail.js'
import recordResult from './recordResult.js'

global.DB_FILE_PATH = './results.json'

/**
 * @typedef {Object} Target
 * @property {string} name
 * @property {string} url
 * @property {string|import('./querySelectorAll').SelectorFunction} selector
 * @property {RegExp} pattern
 */

/**
 * @typedef {Object} Options
 * @property {string} from
 * @property {string} to
 * @property {string} [smtpHost]
 * @property {number} [smtpPort]
 * @property {string} [smtpUser]
 * @property {string} [smtpPass]
 */

/**
 * @param {Target} pTarget
 * @param {Options} pOptions
 * @returns
 */
async function scrapeAlertTarget(pTarget, pOptions) {
	const { name, url, selector, pattern } = pTarget

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

	const email = await makeEmail(name, transportOptions, transportDefault)

	const browser = await puppeteer.launch({
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--font-render-hinting=none',
		],
	})
	const page = await browser.newPage()

	page.setViewport({ width: 1366, height: 768 })

	try {
		await page.goto(url)
	} catch {
		log(`failed to load url ${url}`, { prefix: name })

		try {
			log(`sending email alerting load failure`, { prefix: name })

			recordResult(`The url ${url} failed to load`)

			await email({
				subject: `🛠 Scrape Alert: Couldn't load url for the '${name}' scraper`,
				text: `The url ${url} failed to load.`,
			})
		} catch (pError) {
			log(`email failed to send - ${pError}`, { prefix: name })
		}

		return await browser.close()
	}

	let listingElements
	try {
		listingElements = await querySelectorAll(selector, page)
	} catch {
		log(`no elements match CSS selector at ${url}`, { prefix: name })

		const screenshot = await page.screenshot({ fullPage: true })
		try {
			log(`sending email alerting no elements matched`, { prefix: name })

			recordResult(
				`No matches for the CSS selector '${selector}' were found at ${url}. This could mean that the structure of the page has changed and the CSS selector may need to be modified.`
			)

			await email({
				subject: `🛠 Scrape Alert: Couldn't find any elements for the '${name}' scraper`,
				text: `No matches for the CSS selector '${selector}' were found at ${url}. This could mean that the structure of the page has changed and the CSS selector may need to be modified.`,
				attachments: [
					{
						filename: 'screenshot.png',
						content: /** @type {Buffer} */ (screenshot),
					},
				],
			})
		} catch (pError) {
			log(`email failed to send - ${pError}`, { prefix: name })
		}

		return await browser.close()
	}

	if (pattern) {
		listingElements = await filterAsync(listingElements, (listingElement) =>
			isElementMatch(listingElement, pattern)
		)
	}

	const matchCount = listingElements.length
	if (matchCount) {
		log(`${matchCount} elements matched`, { prefix: name })

		const screenshot = await page.screenshot({ fullPage: true })
		try {
			log('sending email alerting elements matched', { prefix: name })

			recordResult(`${matchCount} matches found at ${url}`)

			await email({
				subject: `⚠️ Scrape Alert: '${name}'`,
				text: `${matchCount} matches found at ${url}`,
				attachments: [
					{
						filename: 'screenshot.png',
						content: /** @type {Buffer} */ (screenshot),
					},
				],
			})
		} catch (pError) {
			log(`email failed to send - ${pError}`, { prefix: name })
		}
	} else {
		log('no matches found', { prefix: name })
	}

	await browser.close()
}

/**
 * @param {Target[]} pTargets
 * @param {Options} pOptions
 * @returns
 */
export default async function scrapeAlert(pTargets, pOptions) {
	return pTargets.forEach((pTarget) => scrapeAlertTarget(pTarget, pOptions))
}
