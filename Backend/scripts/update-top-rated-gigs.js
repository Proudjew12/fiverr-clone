import dotenv from 'dotenv'

dotenv.config({ path: new URL('../.env', import.meta.url).pathname })

const { dbService } = await import('../services/db.service.js')

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const gigPath = join(__dirname, '../../Frontend/data/gig.json')
const gigData = JSON.parse(await readFile(gigPath, 'utf8'))

async function main() {
  const collection = await dbService.getCollection('gig')
  const gigs = gigData || []
  let updated = 0

  for (const gig of gigs) {
    const ownerLevel = String(gig?.owner?.level || '').toLowerCase()
    if (ownerLevel !== 'top rated') continue

    const filter = {
      title: gig.title,
      'owner.fullname': gig?.owner?.fullname || '',
    }

    const update = {
      $set: {
        descriptionHtml: gig.descriptionHtml || '',
        reviews: Array.isArray(gig.reviews) ? gig.reviews : [],
        updatedAt: Date.now(),
      },
    }

    const res = await collection.updateOne(filter, update)
    if (res.matchedCount) updated += 1
  }

  await dbService.close()
  console.log(`Updated top rated gigs in DB: ${updated}`)
}

main().catch((err) => {
  console.error('Failed to update top rated gigs:', err)
  process.exit(1)
})
