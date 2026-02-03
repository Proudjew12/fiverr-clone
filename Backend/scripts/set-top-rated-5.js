import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '..', '.env') })

const dbUrl = process.env.DB_URL
const dbName = process.env.DB_NAME

if (!dbUrl || !dbName) {
  console.error('Missing DB_URL or DB_NAME in Backend/.env')
  process.exit(1)
}

const client = new MongoClient(dbUrl)

try {
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection('gig')

  const result = await collection.updateMany(
    { 'owner.level': { $regex: '^top rated$', $options: 'i' } },
    { $set: { 'owner.rate': 5 } }
  )

  console.log(`Set 5-star rating for ${result.modifiedCount} top rated gigs.`)
} catch (err) {
  console.error('Failed to update top rated gigs:', err)
  process.exitCode = 1
} finally {
  await client.close()
}
