import puppeteer from 'puppeteer'
import querySelectorAll from './querySelectorAll.js'
import isElementMatch from './isElementMatch.js'
import filterAsync from './filterAsync.js'
import log from './log.js'
import makeEmail from './makeEmail.js'
import recordResult from './recordResult.js'

/**
 * @callback LogFunction
 * @param {...any} [pValue]
 * @returns {void}
 */

/**
 * @param {Object} pTarget
 * @param {string} pTarget.name
 * @param {string} pTarget.url
 * @param {string|import('./querySelectorAll').SelectorFunction} pTarget.selector
 * @param {RegExp} pTarget.pattern
 * @param {Object} pOptions
 * @param {string} pOptions.from
 * @param {string} pOptions.to
 * @param {string} [pOptions.smtpHost]
 * @param {number} [pOptions.smtpPort]
 * @param {string} [pOptions.smtpUser]
 * @param {string} [pOptions.smtpPass]
 * @returns
 */
export default async function scrapeAlert(pTarget, pOptions) {
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
		log(name, `failed to load url ${url}`)

		try {
			log(name, `sending email alerting load failure`)

			recordResult(`The url ${url} failed to load`)

			await email({
				subject: `🛠 Scrape Alert: Couldn't load url for the '${name}' scraper`,
				text: `The url ${url} failed to load.`,
			})
		} catch (pError) {
			log(name, `email failed to send - ${pError}`)
		}

		return await browser.close()
	}

	let listingElements
	try {
		listingElements = await querySelectorAll(selector, page)
	} catch {
		log(name, `no elements match CSS selector at ${url}`)

		const screenshot = await page.screenshot({ fullPage: true })
		try {
			log(name, `sending email alerting no elements matched`)

			recordResult(`No matches for the CSS selector '${selector}' were found at ${url}. This could mean that the structure of the page has changed and the CSS selector may need to be modified.`)

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
			log(name, `email failed to send - ${pError}`)
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
		log(name, `${matchCount} elements matched`)

		const screenshot = await page.screenshot({ fullPage: true })
		try {
			log(name, 'sending email alerting elements matched')

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
			log(name, `email failed to send - ${pError}`)
		}
	} else {
		log(name, 'no matches found')
	}

	await browser.close()
}
