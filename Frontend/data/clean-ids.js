import fs from 'fs'

const data = JSON.parse(fs.readFileSync('gig.json', 'utf8'))

const cleaned = data.map(({ _id, ...rest }) => rest)

fs.writeFileSync(
  'gig.json',
  JSON.stringify(cleaned, null, 2)
)

console.log('✔ gigs-no-id.json נוצר בהצלחה')
