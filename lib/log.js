/**
 * @param {string} pMessage
 * @param {Object} [pOptions]
 * @param {string} [pOptions.prefix]
 */
export default function log(pMessage, pOptions = {}) {
	const { prefix } = pOptions

	const text = [
		new Date().toISOString(),
		prefix ? `[${prefix}]` : null,
		pMessage,
	]
		.filter(Boolean)
		.join(' ')

	console.log(text)
}
