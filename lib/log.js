/**
 * @param {string} pPrefix
 * @param {string} pMessage
 */
export default function log(pPrefix, pMessage) {
	console.log(new Date().toISOString(), `[${pPrefix}] ${pMessage}`)
}
