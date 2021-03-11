const axios = require('axios')
const { JSDOM } = require('jsdom')
const nodemailer = require('nodemailer')
const pretty = require('pretty')

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

const log = pMessage => {
	console.log((new Date()).toISOString(), pMessage)
}

const makeTransportOptions = async () => {
	if (smtpHost && smtpPort && smtpUser && smtpPass) {
		return {
			host: smtpHost,
			port: smtpPort,
			auth: {
				user: smtpUser,
				pass: smtpPass,
			}
		}
	}

	log('Not all SMTP properties set, using nodemailer defaults')

	const {
		smtp: {
			host,
			port
		},
		user,
		pass
	} = await nodemailer.createTestAccount();

	return {
		host,
		port,
		auth: {
			user,
			pass
		}
	}
}

const email = async (pSubject, pMessage) => {
	const transportOptions = await makeTransportOptions()

	const transport = nodemailer.createTransport(transportOptions)

	const mailOptions = {
		from: from,
		to: to,
		subject: pSubject,
		text: pMessage,
	}

	await new Promise((pResolve, pReject) => {
		transport.sendMail(mailOptions, (pError, pInfo) => {
			pError ? pReject(pError) : pResolve(pInfo)
		})
	})
}

const main = async pTarget => {
	const { name, url, selector, pattern } = pTarget

	const result = await axios.get(url)
	const dom = new JSDOM(result.data)
	const { document } = dom.window
	const targetElements = document.querySelectorAll(selector)

	if (targetElements.length) {
		const filteredElements = Array.from(targetElements).filter(pTargetElement => {
			return pTargetElement.textContent.match(pattern)
		})

		const { length } = filteredElements
		if (filteredElements.length) {
			log(`[${name}] ${length} elements matched`)

			try {
				log(`[${name}] sending email alerting elements matched`)
				email(
					`⚠️ Scrape Alert: '${name}'`,
					`${length} matches found in ${url}
					
					${pretty(dom.serialize())}`,
				)
			} catch (error) {
				log(`[${name}] email filed to send - ${error}`)
			}
			
		} else {
			log(`[${name}] no matches found`)
		}
	} else {
		log(`[${name}] no elements match CSS selector '${selector}' at ${url}`)

		try {
			log(`[${name}] sending email alerting no elements matched`)

			await email(
				`🛠 Scrape Alert: Couldn't find any elements for the '${name}' scraper`,
				`No matches for the CSS selector '${selector}' were found at ${url}. This could mean that the structure of the page has changed and the CSS selector may need to be modified.
				
				${pretty(dom.serialize())}`,
			)
			
		} catch (error) {
			log(`[${name}] email filed to send - ${error}`)
		}

	}
}

targets.forEach(main)