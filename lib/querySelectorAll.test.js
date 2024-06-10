import assert from 'assert/strict'
import puppeteer from 'puppeteer'
import { html } from 'common-tags'
import sinon from 'sinon'
import querySelectorAll from './querySelectorAll.js'

describe('querySelectorAll', () => {
	let browser
	let page

	beforeEach(async () => {
		browser = await puppeteer.launch({
			args: ['--no-sandbox'],
		})

		page = await browser.newPage()
	})

	afterEach(async () => {
		await browser.close()
	})

	describe('string selector', () => {
		it('should NOT match any elements', async () => {
			const clock = sinon.useFakeTimers()

			await page.setContent('<h1>Foo</h1>')

			const assertPromise = assert.rejects(querySelectorAll('h2', page))

			await page.addScriptTag({ path: './test/fake-timers.js' })

			await page.evaluate(() => {
				// @ts-ignore
				fakeTimers.createClock().next()
			})

			await clock.runToLastAsync()

			return assertPromise
		})

		it('should match single element', async () => {
			await page.setContent('<h1>Foo</h1>')

			const matches = await querySelectorAll('h1', page)

			assert.equal(matches.length, 1)
		})

		it('should match multiple elements', async () => {
			await page.setContent(html`
				<div>
					<h1>Foo</h1>
					<h1>Bar</h1>
				</div>
			`)

			const matches = await querySelectorAll('h1', page)

			assert.equal(matches.length, 2)
		})
	})

	describe('selector function', () => {
		it('should match NO elements', async () => {
			await page.setContent('<h1>Foo</h1>')

			/**
			 * @param {puppeteer.Page} pPage
			 */
			async function selector(pPage) {
				return await pPage.$$('h2')
			}

			const matches = await querySelectorAll(selector, page)

			assert.equal(matches.length, 0)
		})

		it('should match single element', async () => {
			await page.setContent('<h1>Foo</h1>')

			/**
			 * @param {puppeteer.Page} pPage
			 */
			async function selector(pPage) {
				return await pPage.$$('h1')
			}

			const matches = await querySelectorAll(selector, page)

			assert.equal(matches.length, 1)
		})

		it('should match multiple elements', async () => {
			await page.setContent(html`
				<div>
					<h1>Foo</h1>
					<h1>Bar</h1>
				</div>
			`)

			/**
			 * @param {puppeteer.Page} pPage
			 */
			async function selector(pPage) {
				return await pPage.$$('h1')
			}

			const matches = await querySelectorAll(selector, page)

			assert.equal(matches.length, 2)
		})
	})
})
