import { join } from 'path'
import { Low, JSONFile } from 'lowdb'

/**
 * @typedef {Object} Result
 * @property {number} timestamp
 * @property {string} message
 * @property {import('./scrape').Target} target
 */

export default class Results {
	/**
	 * @type {Low<Result[]>}
	 */
	#db

	/**
	 * @type {Result[]}
	 */
	#results

	constructor() {
		const file = join(process.cwd(), global.DB_FILE_PATH)
		/** @type {JSONFile<Result[]>} */
		const adapter = new JSONFile(file)
		this.#db = new Low(adapter)
	}

	async #init() {
		if (this.#results) {
			return
		}

		await this.#db.read()

		this.#results = this.#db.data || []
	}

	async getData() {
		await this.#init()

		return this.#results
	}

	/**
	 * @param {import('./scrape').Target} pTarget
	 * @param {string} pMessage
	 */
	async add(pTarget, pMessage) {
		await this.#init()

		this.#results.push({
			timestamp: Date.now(),
			message: pMessage,
			target: pTarget,
		})
	}

	async purge() {
		await this.#init()

		this.#results = []
	}

	async write() {
		await this.#init()

		this.#db.data = this.#results

		await this.#db.write()
	}
}
