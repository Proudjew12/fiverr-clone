import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..')
const publicRoot = path.join(repoRoot, 'Frontend', 'public')
const assetsRoot = path.join(publicRoot, 'assets', 'OfficalGigDemoData')
const profileDir = path.join(assetsRoot, 'ProfilePicture')
const servicesRoot = path.join(assetsRoot, 'Services')

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp'])
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.ogg'])

const OWNER_LEVELS = ['top rated', '2', '1', 'basic', '2', '1', 'basic']
const LOCATIONS = [
  'United States',
  'United Kingdom',
  'Germany',
  'Canada',
  'Israel',
  'Spain',
  'France',
  'Italy',
  'Netherlands',
  'Portugal',
]

const OWNER_NAMES = [
  'Ava Brooks',
  'Liam Carter',
  'Mia Collins',
  'Noah Wright',
  'Sofia Reed',
  'Ethan Hayes',
  'Isabella Cole',
  'Lucas Foster',
  'Amelia Gray',
  'Logan Price',
  'Harper Stone',
  'Mason Ward',
  'Ella Hart',
  'James Cooper',
  'Chloe Bennett',
  'Benjamin Scott',
  'Scarlett Rivera',
  'Henry Morgan',
  'Lily Sanders',
  'Jack Parker',
  'Grace Mitchell',
  'Daniel Brooks',
  'Zoey James',
  'Owen Peterson',
  'Nora Wood',
  'Caleb Evans',
  'Aria Sullivan',
  'Wyatt Hughes',
  'Avery Powell',
  'Levi Bennett',
  'Madison Ross',
  'Isaac Perry',
  'Stella Long',
  'Sebastian Diaz',
  'Hannah Ruiz',
  'Julian Kim',
  'Victoria Brooks',
  'Samuel Lee',
  'Layla Adams',
  'Gabriel Flores',
  'Riley Turner',
  'Nathan Cook',
  'Zoe Hill',
  'Eli Green',
  'Paisley Ward',
  'Leo Morales',
  'Addison Price',
  'Andrew Cox',
  'Lucy Baker',
  'David Torres',
  'Maya Rivera',
  'Carter Young',
  'Naomi King',
  'Mateo Allen',
  'Eva Morris',
  'Josiah Foster',
  'Kylie Simmons',
  'Hudson Barnes',
  'Piper Powell',
  'Asher Coleman',
  'Eleanor Grant',
  'Ryan Collins',
  'Ruby Diaz',
]

const SERVICE_CONFIG = [
  {
    key: 'WebBuilder',
    tag: 'web-builder',
    label: 'Web Builder',
    priceRange: [120, 520],
    titles: [
      'I will build a clean Web Builder landing page',
      'I will create a responsive web builder site',
      'I will design a modern website with custom sections',
      'I will fix and optimize your web builder layout',
      'I will craft a high-converting website with UX-first layout and mobile polish',
      'I will build a full web builder site with animations, CMS, and performance tuning',
    ],
    description:
      'Web Builder service with modern UX, mobile-first layout, fast performance, and clean structure. Expect smooth sections, smart layout decisions, and fast delivery.',
  },
  {
    key: 'VideoEditing',
    tag: 'video-editing',
    label: 'Video Editing',
    priceRange: [90, 420],
    titles: [
      'I will edit your video with clean cuts',
      'I will deliver cinematic video editing',
      'I will edit YouTube or TikTok videos',
      'I will polish your footage with transitions and color',
      'I will craft a cinematic edit with sound design, pacing, and story flow',
      'I will edit a full video package with captions, hooks, and branding',
    ],
    description:
      'Professional video editing with pacing, color, sound design, captions, and delivery formats for social platforms and YouTube.',
  },
  {
    key: 'Shopify',
    tag: 'shopify',
    label: 'Shopify',
    priceRange: [150, 600],
    titles: [
      'I will build your Shopify store',
      'I will customize your Shopify theme',
      'I will set up Shopify products and collections',
      'I will optimize Shopify for conversions',
      'I will design a Shopify storefront with conversion-focused layout and brand styling',
      'I will build a full Shopify experience with apps, upsells, and custom sections',
    ],
    description:
      'Shopify setup with theme customization, product organization, conversion-focused design, and app configuration.',
  },
  {
    key: 'AdAndSocial',
    tag: 'ad-social',
    label: 'Ad & Social',
    priceRange: [70, 360],
    titles: [
      'I will design ad creatives for social media',
      'I will create social ads that convert',
      'I will craft short ad videos for paid campaigns',
      'I will build brand-ready social media creatives',
      'I will produce social ads with hooks, captions, and platform-ready formats',
      'I will plan and deliver a social ad set with multiple variations and testing angles',
    ],
    description:
      'Social ad creative for Meta, TikTok, and Instagram with hooks, captions, and platform-ready formats.',
  },
]

const REVIEW_TEXTS = [
  'Super clean delivery and fast communication.',
  'Great work and very smooth process.',
  'High quality output. Will order again.',
  'Quick turnaround and excellent attention to detail.',
  'Exactly what I needed. Professional and polished.',
  'Amazing results — exceeded expectations.',
]

async function listFiles(dir, exts) {
  const entries = await fs.readdir(dir)
  return entries
    .filter((name) => exts.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'en'))
}

function toPublicPath(absPath) {
  const rel = path.relative(publicRoot, absPath).split(path.sep).join('/')
  return `/${rel}`
}

function pickFrom(list, idx) {
  return list[idx % list.length]
}

function pickImages(images, idx) {
  if (!images.length) return []
  return [
    images[idx % images.length],
    images[(idx + 3) % images.length],
    images[(idx + 7) % images.length],
  ]
}

function buildOwner(idx, profilePics) {
  const name = pickFrom(OWNER_NAMES, idx)
  const imgUrl = pickFrom(profilePics, idx)
  const level = pickFrom(OWNER_LEVELS, idx)
  const baseRate = level === 'top rated' ? 5 : level === '2' ? 4.9 : level === '1' ? 4.8 : 4.7
  const rate = Number((baseRate - (idx % 3) * 0.03).toFixed(1))
  return {
    _id: `u${idx + 1}`,
    fullname: name,
    imgUrl,
    level,
    rate,
  }
}

function buildReviews(idx, profilePics) {
  const reviews = []
  for (let i = 0; i < 3; i++) {
    const reviewerIdx = idx + i + 1
    reviews.push({
      id: `r${idx + 1}-${i + 1}`,
      txt: pickFrom(REVIEW_TEXTS, reviewerIdx),
      rate: Number((4.7 + ((reviewerIdx % 4) * 0.1)).toFixed(1)),
      by: {
        _id: `u${reviewerIdx + 200}`,
        fullname: pickFrom(OWNER_NAMES, reviewerIdx + 7),
        imgUrl: pickFrom(profilePics, reviewerIdx + 5),
      },
    })
  }
  return reviews
}

function buildPrice(range, idx) {
  const [min, max] = range
  const span = max - min
  return min + (idx * 13) % (span + 1)
}

async function buildGigs() {
  const profilePics = (await listFiles(profileDir, IMAGE_EXTS)).map((name) =>
    toPublicPath(path.join(profileDir, name))
  )

  if (!profilePics.length) {
    throw new Error('No profile pictures found.')
  }

  const gigs = []
  let ownerIdx = 0
  let gigIdx = 0

  for (const service of SERVICE_CONFIG) {
    const imgDir = path.join(servicesRoot, service.key, 'Img')
    const videoDir = path.join(servicesRoot, service.key, 'Videos')

    const images = (await listFiles(imgDir, IMAGE_EXTS)).map((name) =>
      toPublicPath(path.join(imgDir, name))
    )
    const videos = (await listFiles(videoDir, VIDEO_EXTS)).map((name) =>
      toPublicPath(path.join(videoDir, name))
    )

    if (!videos.length) {
      throw new Error(`No videos found for ${service.key}`)
    }
    if (images.length < 3) {
      throw new Error(`Not enough images for ${service.key}`)
    }

    for (let i = 0; i < videos.length; i++) {
      const owner = buildOwner(ownerIdx, profilePics)
      const title = pickFrom(service.titles, i)
      const description = service.description
      const imgUrls = pickImages(images, i)
      const price = buildPrice(service.priceRange, i)
      const daysToMake = 1 + (i % 5)
      const avgResponseTime = 1 + (i % 3)
      const loc = pickFrom(LOCATIONS, i + ownerIdx)
      const createdAt = Date.now() - (gigIdx % 45) * 24 * 60 * 60 * 1000

      gigs.push({
        _id: `g${gigIdx + 1}`,
        title,
        price,
        owner,
        daysToMake,
        description,
        avgResponseTime,
        loc,
        imgUrl: imgUrls[0],
        imgUrls,
        videoUrls: [videos[i]],
        tags: [service.tag],
        likedByUsers: [],
        reviews: buildReviews(gigIdx, profilePics),
        createdAt,
        updatedAt: createdAt,
      })

      ownerIdx += 1
      gigIdx += 1
    }
  }

  return { gigs, profilePics }
}

async function updateDemoData({ sampleImages, sampleVideos, ownerNames }) {
  const demoPath = path.join(repoRoot, 'Frontend', 'src', 'data', 'demo-data.json')
  const raw = await fs.readFile(demoPath, 'utf8')
  const demoData = JSON.parse(raw)

  demoData.home.heroChips = ['Web Builder', 'Video Editing', 'Shopify', 'Ad & Social']
  demoData.home.categories = [
    { key: 'web-builder', label: 'Web\nBuilder', icon: 'Programming' },
    { key: 'video-editing', label: 'Video\nEditing', icon: 'Video' },
    { key: 'shopify', label: 'Shopify', icon: 'Business' },
    { key: 'ad-social', label: 'Ad &\nSocial', icon: 'Marketing' },
  ]
  demoData.home.popularServices = [
    { key: 'web-builder', title: 'Web\nBuilder', bg: '#003912', icon: 'popularCarousel2' },
    { key: 'video-editing', title: 'Video Editing', bg: '#003912', icon: 'popularCarousel3' },
    { key: 'shopify', title: 'Shopify', bg: '#003912', icon: 'popularCarousel7' },
    { key: 'ad-social', title: 'Ad & Social', bg: '#003912', icon: 'popularCarousel6' },
  ]

  demoData.subHeader.categories = [
    { key: 'web-builder', label: 'Web Builder', tag: 'web-builder' },
    { key: 'video-editing', label: 'Video Editing', tag: 'video-editing' },
    { key: 'shopify', label: 'Shopify', tag: 'shopify' },
    { key: 'ad-social', label: 'Ad & Social', tag: 'ad-social' },
  ]

  demoData.randomGig.titles = [
    'I will build a clean web builder landing page',
    'I will craft a Shopify store that converts',
    'I will edit your video with clean cuts',
    'I will design ad creatives for social media',
    'I will build a high-converting website with mobile polish and UX strategy',
    'I will deliver cinematic video editing with sound design and pacing',
    'I will optimize your Shopify theme with custom sections and apps',
    'I will create a social ad set with hooks, captions, and multiple variations',
  ]
  demoData.randomGig.tags = ['web-builder', 'video-editing', 'shopify', 'ad-social']
  demoData.randomGig.fullnames = ownerNames
  demoData.randomGig.videos = sampleVideos
  demoData.randomGig.images = sampleImages
  demoData.fallbackThumbs = sampleImages.slice(0, 4)

  await fs.writeFile(demoPath, JSON.stringify(demoData, null, 2))
}

async function writeGigJson(gigs) {
  const outPath = path.join(repoRoot, 'Frontend', 'data', 'gig.json')
  await fs.writeFile(outPath, JSON.stringify(gigs, null, 2))
  return outPath
}

async function updateMongo(gigs) {
  dotenv.config({ path: path.join(repoRoot, 'Backend', '.env') })
  const url = process.env.DB_URL
  const dbName = process.env.DB_NAME
  if (!url || !dbName) {
    throw new Error('Missing DB_URL or DB_NAME in Backend/.env')
  }

  const client = new MongoClient(url)
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection('gig')
  await collection.deleteMany({})
  const { insertedCount } = await collection.insertMany(
    gigs.map((gig) => {
      const rest = { ...gig }
      delete rest._id
      return rest
    })
  )
  await client.close()
  return insertedCount
}

async function main() {
  const args = new Set(process.argv.slice(2))
  const writeDb = args.has('--write-db')

  const { gigs, profilePics } = await buildGigs()
  const allVideos = gigs.flatMap((gig) => gig.videoUrls || [])
  const allImages = gigs.flatMap((gig) => gig.imgUrls || [])
  const sampleVideos = allVideos.slice(0, 20)
  const sampleImages = allImages.slice(0, 12)

  await writeGigJson(gigs)
  await updateDemoData({
    sampleImages,
    sampleVideos,
    ownerNames: OWNER_NAMES,
  })

  if (writeDb) {
    const inserted = await updateMongo(gigs)
    console.log(`Inserted ${inserted} gigs into MongoDB.`)
  }

  console.log(`Generated ${gigs.length} gigs.`)
  console.log(`Profile pictures loaded: ${profilePics.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
