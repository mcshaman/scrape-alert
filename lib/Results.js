import { join } from 'path'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

/**
 * @typedef {Object} Result
 * @property {number} timestamp
 * @property {number} matchCount
 * @property {boolean} error
 * @property {import('./scrape.js').Target} target
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
		this.#db = new Low(adapter, [])
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
	 * @typedef {Object} Data
	 * @param {number} [matchCount]
	 * @param {boolean} [error]
	 * @param {import('./scrape.js').Target} target
	 */

	/**
	 * @param {Data} pData
	 */
	async add(pData) {
		await this.#init()

		const { matchCount = 0, error = false, target } = pData

		this.#results.push({
			timestamp: Date.now(),
			matchCount,
			error,
			target,
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
