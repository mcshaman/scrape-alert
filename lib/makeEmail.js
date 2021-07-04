import nodemailer from 'nodemailer/lib/nodemailer.js'
import Mail from 'nodemailer/lib/mailer/index.js'
import log from './log.js'

/**
 * @param {import('nodemailer/lib/smtp-transport').Options} pOptions
 * @returns
 */
async function makeTransportOptions(pLogPrefix, pOptions = {}) {
	if ('host' in pOptions && 'port' in pOptions && 'auth' in pOptions) {
		const auth = pOptions.auth || {}

		if ('user' in auth && 'pass' in auth) {
			return pOptions
		}
	}

	log('Not all SMTP properties set, using nodemailer test account', { prefix: pLogPrefix })

	const {
		smtp: { host, port },
		user,
		pass,
	} = await nodemailer.createTestAccount()

	return {
		...pOptions,
		host,
		port,
		auth: {
			user,
			pass,
		},
	}
}

/**
 * @callback EmailFunction
 * @param {Mail.Options} pMailOptions
 * @returns {Promise<void>}
 */

/**
 * @param {import('nodemailer/lib/smtp-transport').Options} pOptions
 * @param {import('nodemailer/lib/mailer').Options} pDefaults
 * @returns {Promise<EmailFunction>}
 */
export default async function makeEmail(pLogPrefix, pOptions, pDefaults) {
	const transportOptions = await makeTransportOptions(pLogPrefix, pOptions)

	const transport = nodemailer.createTransport(transportOptions, pDefaults)

	return function email(pMailOptions) {
		return new Promise((pResolve, pReject) => {
			transport.sendMail(pMailOptions, (pError, pInfo) => {
				pError ? pReject(pError) : pResolve(pInfo)
			})
		})
	}
}
