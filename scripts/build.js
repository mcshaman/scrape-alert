#!/usr/bin/env node

import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'

childProcess.execSync('npm pack', { stdio: 'inherit' })

const file = fs.readFileSync(path.join(process.cwd(), 'package.json'))
const { name, version } = JSON.parse(file.toString())

const packFile = `${name}-${version}.tgz`

childProcess.execSync(`
	docker build \
		--build-arg PACK_FILE="${packFile}" \
		--tag ${name}:${version} \
		.
`, { stdio: 'inherit' })


childProcess.execSync(`
	docker tag ${name}:${version} ${name}:latest
`, { stdio: 'inherit' })

fs.unlinkSync(path.join(process.cwd(), packFile))
