import getResults from './getResults.js'

/**
 * @param {string} pMessage 
 */
export default async function recordResult(pMessage) {
	const results = await getResults()

	results.data ||= []

	results.data.push({
		timestamp: Date.now(),
		message: pMessage,
	})

	await results.write()
}
