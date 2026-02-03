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

function randomRating() {
  const value = 4.7 + Math.random() * 0.3
  return Math.round(value * 10) / 10
}

const client = new MongoClient(dbUrl)

try {
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection('gig')

  const gigs = await collection.find({}, { projection: { _id: 1 } }).toArray()
  if (!gigs.length) {
    console.log('No gigs found to update.')
    process.exit(0)
  }

  const ops = gigs.map((gig) => ({
    updateOne: {
      filter: { _id: gig._id },
      update: { $set: { 'owner.rate': randomRating() } },
    },
  }))

  const result = await collection.bulkWrite(ops, { ordered: false })
  console.log(`Updated ${result.modifiedCount} gigs with ratings 4.7–5.0.`)
} catch (err) {
  console.error('Failed to update ratings:', err)
  process.exitCode = 1
} finally {
  await client.close()
}
