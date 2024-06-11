import assert from 'assert/strict'
import sinon from 'sinon'
import log from './log.js'

describe('log', () => {
	/** @type {sinon.SinonSpy<Parameters<typeof console.log>, void>} */
	let consoleLog

	beforeEach(() => {
		sinon.useFakeTimers(0)

		consoleLog = sinon.stub(console, 'log')
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should include time stamp', () => {
		log('foo')

		assert.equal(consoleLog.firstCall.firstArg, '1970-01-01T00:00:00.000Z foo')
	})

	it('should include prefix', () => {
		log('foo', { prefix: 'bar' })

		assert.equal(consoleLog.firstCall.firstArg, '1970-01-01T00:00:00.000Z [bar] foo')
	})
})

