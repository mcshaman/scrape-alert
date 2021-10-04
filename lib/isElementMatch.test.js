import assert from 'assert/strict'
import puppeteer from 'puppeteer'
import isElementMatch from './isElementMatch.js'

describe('isElementMatch', () => {
	let browser
	let page

	beforeEach(async () => {
		browser = await puppeteer.launch()

		page = await browser.newPage()
	})

	afterEach(async () => {
		await browser.close()
	})

	it('should match content', async () => {
		await page.setContent('<h1>Foo</h1>')

		const element = await page.$('body')

		const matched = await isElementMatch(element, /Foo/)

		assert.equal(matched, true)
	})

	it('should NOT match content', async () => {
		await page.setContent('<h1>Foo</h1>')

		const element = await page.$('body')

		const matched = await isElementMatch(element, /Bar/)

		assert.equal(matched, false)
	})

	it('should NOT match case sensitive', async () => {
		await page.setContent('<h1>Foo</h1>')

		const element = await page.$('body')

		const matched = await isElementMatch(element, /foo/)

		assert.equal(matched, false)
	})

	it('should match case insensitive', async () => {
		await page.setContent('<h1>Foo</h1>')

		const element = await page.$('body')

		const matched = await isElementMatch(element, /foo/i)

		assert.equal(matched, true)
	})
})
