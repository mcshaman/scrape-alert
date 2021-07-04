import puppeteer from 'puppeteer'
import querySelectorAll from './querySelectorAll.js'
import isElementMatch from './isElementMatch.js'
import filterAsync from './filterAsync.js'
import log from './log.js'

/**
 * @typedef {Object} Target
 * @property {string} name
 * @property {string} url
 * @property {string|import('./querySelectorAll').SelectorFunction} selector
 * @property {RegExp} pattern
 */

/**
 * @callback OnLoadPage
 * @param {Target} context
 * @returns {Promise<void>}
 */

/**
 * @typedef {Buffer | string} Screenshot
 */

/**
 * @typedef {Target & {
 *     screenshot?: Screenshot
 * }} NoMatchContext
 */

/**
 * @callback OnNoMatch
 * @param {NoMatchContext} context
 * @returns {Promise<void>}
 */

/**
 * @typedef {NoMatchContext & {
 *     matchCount: number
 * }} MatchContext
 */

/**
 * @callback OnMatch
 * @param {MatchContext} context
 * @returns {Promise<void>}
 */

/**
 * @param {Target} pTarget
 * @param {Object} [pOptions]
 * @param {OnLoadPage} [pOptions.onLoadPage]
 * @param {OnNoMatch} [pOptions.onNoMatch]
 * @param {OnMatch} [pOptions.onMatch]
 * @returns {Promise<void>}
 */
export default async function scrape(pTarget, pOptions = {}) {
	const { name: prefix, url, selector, pattern } = pTarget

	const { onLoadPage, onNoMatch, onMatch } = pOptions

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
		log(`failed to load url ${url}`, { prefix })

		if (onLoadPage) {
			await onLoadPage(pTarget)
		}

		return await browser.close()
	}

	let listingElements
	try {
		listingElements = await querySelectorAll(selector, page)
	} catch {
		log(`no elements match CSS selector at ${url}`, { prefix })

		const screenshot = /** @type {Buffer | string | undefined} */ (
			await page.screenshot({ fullPage: true })
		)

		if (onNoMatch) {
			await onNoMatch({ ...pTarget, screenshot })
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
		log(`${matchCount} elements matched`, { prefix })

		const screenshot = /** @type {Buffer | string | undefined} */ (
			await page.screenshot({ fullPage: true })
		)

		if (onMatch) {
			await onMatch({ ...pTarget, screenshot, matchCount })
		}
	} else {
		log('no matches found', { prefix })
	}

	await browser.close()
}
