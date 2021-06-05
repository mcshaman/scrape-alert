import puppeteer from "puppeteer"

/**
 * @callback SelectorFunction
 * @param {puppeteer.Page} pPage
 * @returns {Promise<puppeteer.ElementHandle[]>}
 */

/**
 * @param {string|SelectorFunction} pSelector 
 * @param {puppeteer.Page} pPage 
 * @returns
 */
export default async function querySelectorAll(pSelector, pPage) {
	if (typeof pSelector === 'function') {
		return await pSelector(pPage)
	}

	await pPage.waitForSelector(pSelector)
	return await pPage.$$(pSelector)
}
