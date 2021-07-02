import { join } from 'path'
import { Low, JSONFile } from 'lowdb'

export default async function getResult() {
	const file = join(process.cwd(), global.DB_FILE_PATH)
	const adapter = new JSONFile(file)
	const db = new Low(adapter)

	await db.read()

	return db
}