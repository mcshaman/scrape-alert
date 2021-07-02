import getResult from './getResults.js'

/**
 * @param {string} pMessage 
 */
export default async function recordResult(pMessage) {
	const result = await getResult()

	result.data ||= []

	result.data.push({
		timestamp: Date.now(),
		message: pMessage,
	})

	await result.write()
}
