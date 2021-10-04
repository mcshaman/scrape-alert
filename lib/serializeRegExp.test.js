import assert from 'assert/strict'
import serializeRegExp from './serializeRegExp.js'

describe('serializeRegExp', () => {
	it('should serialize regex pattern', () => {
		const serialized = serializeRegExp(/^foo$/)

		assert.equal(serialized.pattern, '^foo$')
	})

	it('should serialize regex flags', () => {
		const serialized = serializeRegExp(/^foo$/gi)

		assert.equal(serialized.flags, 'gi')
	})
})
