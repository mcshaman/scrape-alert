/**
 * @param {RegExp} regExp 
 * @returns {{pattern: string, flags: string}}
 */
export default function serializeRegExp(regExp) {
	const regExpPattern = /\/(.*?)\/([a-z]*)?$/i
	const [_, pattern, flags] = regExpPattern.exec(regExp.toString())

	return { pattern, flags }
}
