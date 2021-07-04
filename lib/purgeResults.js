import getResults from "./getResults.js"

export default async function purgeResults() {
	const results = await getResults()

	results.data = []

	await results.write()
}
