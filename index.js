const nodemailer = require('nodemailer')
const puppeteer = require('puppeteer')

const DEFAULT_CONFIG_PATH = './config-test.js'
const configPath = process.argv[2] || DEFAULT_CONFIG_PATH

const {
	smtpHost,
	smtpPort,
	smtpUser,
	smtpPass,
	targets,
	from,
	to,
} = require(configPath)

const querySelectorAll = async (pSelector, pPage) => {
	if (typeof pSelector === 'function') {
		return await pSelector(pPage)
	}

	await pPage.waitForSelector(pSelector)
	return await pPage.$$(pSelector)
}

const serializeRegExp = (regExp) => {
	const regExpPattern = /\/(.*?)\/([a-z]*)?$/i
	const [_, pattern, flags] = regExpPattern.exec(regExp.toString())

	return { pattern, flags }
}

const isElementMatch = async (pElement, pPattern) => {
	return await pElement.evaluate((pElement, pSerializedRegExp) => {
		const { pattern, flags } = pSerializedRegExp
		const regExp = new RegExp(pattern, flags)
		return regExp.test(pElement.textContent)
	}, serializeRegExp(pPattern))
}

const filterAsync = async (pArray, pPredicate) => {
	const results = await Promise.all(pArray.map(pPredicate));

	return pArray.filter((pValue, pIndex) => results[pIndex]);
}

const log = (pMessage) => {
	console.log(new Date().toISOString(), pMessage)
}

const makeTransportOptions = async () => {
	if (smtpHost && smtpPort && smtpUser && smtpPass) {
		return {
			host: smtpHost,
			port: smtpPort,
			auth: {
				user: smtpUser,
				pass: smtpPass,
			},
		}
	}

	log('Not all SMTP properties set, using nodemailer defaults')

	const {
		smtp: { host, port },
		user,
		pass,
	} = await nodemailer.createTestAccount()

	return {
		host,
		port,
		auth: {
			user,
			pass,
		},
	}
}

const email = async (pOptions) => {
	const transportOptions = await makeTransportOptions()

	const transport = nodemailer.createTransport(transportOptions)

	const mailOptions = {
		from: from,
		to: to,
		...pOptions,
	}

	await new Promise((pResolve, pReject) => {
		transport.sendMail(mailOptions, (pError, pInfo) => {
			pError ? pReject(pError) : pResolve(pInfo)
		})
	})
}

const main = async (pTarget) => {
	const { name, url, selector, pattern } = pTarget

	const browser = await puppeteer.launch({
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--font-render-hinting=none',
		],
	})
	const page = await browser.newPage()

	page.on('console', consoleObj => console.log(consoleObj.text()))

	page.setViewport({ width: 1366, height: 768 })

	try {
		await page.goto(url)
	} catch {
		log(`[${name}] failed to load url ${url}`)

		try {
			log(`[${name}] sending email alerting load failure`)

			email({
				subject: `🛠 Scrape Alert: Couldn't load url for the '${name}' scraper`,
				text: `The url ${url} failed to load.`,
			})
		} catch (pError) {
			log(`[${name}] email filed to send - ${pError}`)
		}

		return await browser.close()
	}

	let listingElements
	try {
		listingElements = await querySelectorAll(selector, page)
	} catch {
		log(`[${name}] no elements match CSS selector '${selector}' at ${url}`)

		const screenshot = await page.screenshot({ fullPage: true })
		try {
			log(`[${name}] sending email alerting no elements matched`)

			await email({
				subject: `🛠 Scrape Alert: Couldn't find any elements for the '${name}' scraper`,
				text: `No matches for the CSS selector '${selector}' were found at ${url}. This could mean that the structure of the page has changed and the CSS selector may need to be modified.`,
				attachments: {
					filename: 'screenshot.png',
					content: screenshot,
				},
			})
		} catch (pError) {
			log(`[${name}] email filed to send - ${pError}`)
		}

		return await browser.close()
	}

	if (pattern) {
		listingElements = await filterAsync(listingElements, listingElement => isElementMatch(listingElement, pattern))
	}

	const matchCount = listingElements.length
	if (matchCount) {
		log(`[${name}] ${matchCount} elements matched`)

		const screenshot = await page.screenshot({ fullPage: true })
		try {
			log(`[${name}] sending email alerting elements matched`)

			email({
				subject: `⚠️ Scrape Alert: '${name}'`,
				text: `${matchCount} matches found at ${url}`,
				attachments: {
					filename: 'screenshot.png',
					content: screenshot,
				},
			})
		} catch (pError) {
			log(`[${name}] email filed to send - ${pError}`)
		}
	} else {
		log(`[${name}] no matches found`)
	}

	await browser.close()
}

targets.forEach(main)
