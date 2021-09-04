import puppeteer from 'puppeteer'
import querySelectorAll from './querySelectorAll.js'
import isElementMatch from './isElementMatch.js'
import filterAsync from './filterAsync.js'
import log from './log.js'

const VIEWPORT_WIDTH = 1366

/**
 * @param {puppeteer.Page} pPage
 */
async function makeScreenshot(pPage) {
	// Resize viewport to address bug where page doesn't render below fold. See https://github.com/puppeteer/puppeteer/issues/1273.
	const bodyHeight = await pPage.evaluate(() => document.body.scrollHeight)
	await pPage.setViewport({ width: VIEWPORT_WIDTH, height: bodyHeight })

	return /** @type {Buffer | string | undefined} */ (
		await pPage.screenshot({ fullPage: true })
	)
}

/**
 * @typedef {Object} Target
 * @property {string} name
 * @property {string} url
 * @property {string|import('./querySelectorAll').SelectorFunction} selector
 * @property {RegExp} pattern
 * @property {boolean} [javaScriptEnabled]
 */

/**
 * @typedef {Object} LoadContext
 * @property {Target} target
 */

/**
 * @callback OnLoadPage
 * @param {LoadContext} context
 * @returns {Promise<void>}
 */

/**
 * @typedef {Buffer | string} Screenshot
 */

/**
 * @typedef {Object} NoMatchContext
 * @property {Target} target
 * @property {Screenshot} [screenshot]
 */

/**
 * @callback OnNoMatch
 * @param {NoMatchContext} context
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} MatchContext
 * @property {Target} target
 * @property {Screenshot} [screenshot]
 * @property {number} matchCount
 */

/**
 * @callback OnMatch
 * @param {MatchContext} context
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} Options
 * @property {OnLoadPage} [onLoadPage]
 * @property {OnNoMatch} [onNoMatch]
 * @property {OnMatch} [onMatch]
 */

/**
 * @param {Target} pTarget
 * @param {Options} [pOptions]
 * @returns {Promise<void>}
 */
export default async function scrape(pTarget, pOptions = {}) {
	const {
		name: prefix,
		url,
		selector,
		pattern,
		javaScriptEnabled = true,
	} = pTarget

	const { onLoadPage, onNoMatch, onMatch } = pOptions

	const browser = await puppeteer.launch({
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--font-render-hinting=none',
		],
	})
	const page = await browser.newPage()

	page.setJavaScriptEnabled(javaScriptEnabled)

	page.setViewport({ width: VIEWPORT_WIDTH, height: 768 })

	try {
		await page.goto(url)
	} catch {
		log(`failed to load url ${url}`, { prefix })

		if (onLoadPage) {
			await onLoadPage({ target: pTarget })
		}

		return await browser.close()
	}

	let listingElements
	try {
		listingElements = await querySelectorAll(selector, page)
	} catch (pError) {
		log(pError)

		return await browser.close()
	}

	if (listingElements.length === 0) {
		log(`no elements match CSS selector at ${url}`, { prefix })

		const screenshot = await makeScreenshot(page)

		if (onNoMatch) {
			await onNoMatch({ target: pTarget, screenshot })
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

		const screenshot = await makeScreenshot(page)

		if (onMatch) {
			await onMatch({ target: pTarget, screenshot, matchCount })
		}
	} else {
		log('no matches found', { prefix })
	}

	await browser.close()
}
