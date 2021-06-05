/**
 * @callback PredicateFunction
 * @param {any} pValue
 * @param {number} pIndex
 * @param {any[]} pArray
 * @returns {Promise<boolean>}
 */

/**
 * @template T
 * @param {T[]} pArray 
 * @param {PredicateFunction} pPredicate
 * @returns
 */
export default async function filterAsync(pArray, pPredicate) {
	const results = await Promise.all(pArray.map(pPredicate))

	return pArray.filter((pValue, pIndex) => results[pIndex])
}
