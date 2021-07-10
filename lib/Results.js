import { join } from 'path'
import { Low, JSONFile } from 'lowdb'

/**
 * @typedef {Object} Result
 * @property {number} timestamp
 * @property {string} message
 */

export default class Results {
	/**
	 * @type {Low<Result[]>}
	 */
	#results

	/**
	 * @type {Result[]}
	 */
	#data

	constructor() {
		const file = join(process.cwd(), global.DB_FILE_PATH)
		/** @type {JSONFile<Result[]>} */
		const adapter = new JSONFile(file)
		this.#results = new Low(adapter)
	}

	async #init() {
		if (this.#data) {
			return
		}

		await this.#results.read()

		this.#data = this.#results.data || []
	}

	async getData() {
		await this.#init()

		return this.#data
	}

	/**
	 * @param {string} pMessage 
	 */
	async add(pMessage) {
		await this.#init()

		this.#data.push({
			timestamp: Date.now(),
			message: pMessage,
		})
	}

	async purge() {
		await this.#init()

		this.#data = []
	}

	async write() {
		await this.#init()

		this.#results.data = this.#data

		await this.#results.write()
	}
}
