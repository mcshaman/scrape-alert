import { join } from 'path'
import { Low, JSONFile } from 'lowdb'

/**
 * @typedef {Object} Result
 * @property {number} timestamp
 * @property {string} message
 */

export default async function getResult() {
	const file = join(process.cwd(), global.DB_FILE_PATH)
	/** @type {JSONFile<Result[]>} */
	const adapter = new JSONFile(file)
	const results = new Low(adapter)

	await results.read()

	return results
}