#!/usr/bin/env node

import meow from 'meow'
import sendReport from './lib/sendReport.js'

const cli = meow(`
	Usage
	  $ send-report
	
	Options
	  --from       Senders email address. Can be plain 'sender@server.com' or formatted '"Sender Name" sender@server.com'.

	  --purge      Purge results database after sending report (defaults to false).

	  --smtp-host  SMTP server hostname or IP address. If any of the SMTP options are not defined test SMTP credentials will be used. 

	  --smtp-pass  SMTP user password. If any of the SMTP options are not defined test SMTP credentials will be used.

	  --smtp-port  SMTP server port. If any of the SMTP options are not defined test SMTP credentials will be used.

	  --smtp-user  SMTP user name. If any of the SMTP options are not defined test SMTP credentials will be used.

	  --to         Comma separated list or an array of recipients email addresses.
`, {
	importMeta: import.meta,
	allowUnknownFlags: false,
	booleanDefault: undefined,
	flags: {
		from: {
			type: 'string',
			isRequired: true,
		},
		to: {
			type: 'string',
			isRequired: true,
		},
		smtpHost: {
			type: 'string',
		},
		smtpPort: {
			type: 'number',
		},
		smtpUser: {
			type: 'string',
		},
		smtpPass: {
			type: 'string',
		},
		purge: {
			type: 'boolean',
			default: false,
		},
		help: {
			type: 'boolean',
		},
	},
})

sendReport(cli.flags)
