import serializeRegExp from "./serializeRegExp.js"

/**
 * @param {import('puppeteer').ElementHandle} pElement
 * @param {RegExp} pPattern
 * @returns
 */
export default async function isElementMatch(pElement, pPattern) {
	return await pElement.evaluate((pElement, pSerializedRegExp) => {
		const { pattern, flags } = pSerializedRegExp
		const regExp = new RegExp(pattern, flags)
		return regExp.test(pElement.textContent)
	}, serializeRegExp(pPattern))
}
