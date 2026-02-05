import dotenv from 'dotenv'

dotenv.config({ path: new URL('../.env', import.meta.url).pathname })

const { dbService } = await import('../services/db.service.js')

const GIG_COLLECTION = 'gig'

async function main() {
  const collection = await dbService.getCollection(GIG_COLLECTION)
  const now = Date.now()

  const gig = {
    title: 'I will edit your video with cinematic cuts, motion graphics, and pro color grading',
    description:
      'Video Editing service focused on clean pacing, cinematic cuts, smooth transitions, and professional color grading. Includes audio cleanup, caption-ready edits, and delivery optimized for YouTube, TikTok, or ads. You will get a polished, ready-to-publish video with consistent branding and motion graphics when needed.',
    descriptionHtml: `
      <p><span class="highlight">Stop wasting</span> your time and money searching for a <em>perfect video editor</em>. You won't find one because video editors focus on only one thing – <strong>editing videos!</strong> But when you're running a business, your ads don't just need to look nice, they need to <span class="highlight">SELL!</span></p>
      <p><span class="highlight">Hi, I'm Stefan</span> and this is where my gig comes in. I'm not just going to edit best ads on Leo, but I'm going to do so following a <span class="highlight">conversion-first approach!</span> Meaning that I prioritize <strong>performance</strong> over anything else.</p>
      <p class="section-title"><span class="highlight">Here's how the gig works:</span></p>
      <ul>
        <li>Message me to discuss your project (and place an order)</li>
        <li>Send the footage and fill in the requirements</li>
        <li>Take a rest while we finish your ad in <strong>24 hours*</strong></li>
        <li>Enjoy up to 3 highly-optimized versions of your ad (with different hooks)</li>
      </ul>
      <p class="section-title"><span class="highlight">Why us?</span></p>
      <ul>
        <li>Over 8 years in the industry</li>
        <li>Helped 500+ clients achieve <strong>ACTUAL results</strong></li>
        <li>Our proven UGC editing formula guarantees more conversions</li>
        <li>Express delivery time</li>
      </ul>
      <p>As you can see, our service is unlike anything else Leo has to offer.</p>
      <p><span class="highlight">Don't hesitate and save your spot while it's available.</span></p>
      <p class="note"><em>*Due to high demand, 24-hour delivery is only available as an extra.</em></p>
      <p class="note"><span class="highlight">IMPORTANT: Prices will be going up to $250 for the Basic package and $375 for the Standard package SOON!</span></p>
    `.trim(),
    price: 189,
    tags: ['video-editing'],
    imgUrl:
      '/assets/OfficalGigDemoData/Main/Stef_Miller_Main/GigImgOrVideo/ImgVE1.jpg',
    imgUrls: [
      '/assets/OfficalGigDemoData/Main/Stef_Miller_Main/GigImgOrVideo/ImgVE1.jpg',
      '/assets/OfficalGigDemoData/Main/Stef_Miller_Main/GigImgOrVideo/ImgVE2.png',
      '/assets/OfficalGigDemoData/Main/Stef_Miller_Main/GigImgOrVideo/ImgVE3.png',
    ],
    videoUrls: [
      '/assets/OfficalGigDemoData/Main/Stef_Miller_Main/GigImgOrVideo/VideoVE.mp4',
    ],
    daysToMake: 2,
    avgResponseTime: 1,
    loc: 'United States',
    owner: {
      _id: 'u117',
      fullname: 'Stefan Miller',
      imgUrl: '/assets/OfficalGigDemoData/Main/Stef_Miller_Main/ProfileImg/ProfileVE.jpeg',
      level: 'top rated',
      rate: 5,
    },
    likedByUsers: [],
    reviews: [
      {
        id: 'r117-1',
        txt: "I really enjoyed working with Stefan. His experience in creating strong DTC ads actually works and the hook strategy was spot on. Thank you so much for your work — I'm looking forward to building with you even further.",
        rate: 5,
        by: {
          _id: 'u301',
          fullname: 'Praise Ehwu',
          imgUrl: '/assets/OfficalGigDemoData/ProfilePicture/[Profile]41.png',
        },
      },
      {
        id: 'r117-2',
        txt: "This is my second time working with Stefan and it won't be my last. He is very creative and responsive to the minor edits I requested. His communication skills are just as good as his creative skills!",
        rate: 5,
        by: {
          _id: 'u302',
          fullname: 'Konraad V',
          imgUrl: '/assets/OfficalGigDemoData/ProfilePicture/[Profile]12.png',
        },
      },
      {
        id: 'r117-3',
        txt: 'Perfect color grade and audio polish. The final export looks premium and consistent with our brand. Stefan also made smart pacing tweaks that made the ad feel much more dynamic.',
        rate: 4.9,
        by: {
          _id: 'u303',
          fullname: 'Maya Chen',
          imgUrl: '/assets/OfficalGigDemoData/ProfilePicture/[Profile]33.png',
        },
      },
      {
        id: 'r117-4',
        txt: 'Great communication and clear edits. Our CTR improved right away and the creative felt much more polished. He even suggested a better opening hook that performed better.',
        rate: 5,
        by: {
          _id: 'u304',
          fullname: 'Liam Carter',
          imgUrl: '/assets/OfficalGigDemoData/ProfilePicture/[Profile]7.png',
        },
      },
      {
        id: 'r117-5',
        txt: 'He refined our raw footage into a conversion-first ad and made it feel high-end. The pacing, captions, and transitions were clean and the end result matched our brand perfectly.',
        rate: 5,
        by: {
          _id: 'u305',
          fullname: 'Nora Silva',
          imgUrl: '/assets/OfficalGigDemoData/ProfilePicture/[Profile]55.png',
        },
      },
      {
        id: 'r117-6',
        txt: 'Hooks were strong and the cut was tight. Exactly what we asked for, but even better. He delivered quickly and was super easy to work with.',
        rate: 4.8,
        by: {
          _id: 'u306',
          fullname: 'Priya Menon',
          imgUrl: '/assets/OfficalGigDemoData/ProfilePicture/[Profile]22.png',
        },
      },
      {
        id: 'r117-7',
        txt: 'Professional, on time, and the ad looks top-tier. Our team loved the structure and the messaging flow. We will definitely order again for the next campaign.',
        rate: 5,
        by: {
          _id: 'u307',
          fullname: 'Ethan Brooks',
          imgUrl: '/assets/OfficalGigDemoData/ProfilePicture/[Profile]69.png',
        },
      },
      {
        id: 'r117-8',
        txt: 'Strong narrative flow and polished transitions. Great creative sense and excellent attention to detail. The final cut kept viewers engaged to the end.',
        rate: 4.9,
        by: {
          _id: 'u308',
          fullname: 'Ahmed Hassan',
          imgUrl: '/assets/OfficalGigDemoData/ProfilePicture/[Profile]2.png',
        },
      },
      {
        id: 'r117-9',
        txt: 'Best editing experience we have had on Leo. The ad performed immediately and the creative quality was top notch. Results speak for themselves.',
        rate: 5,
        by: {
          _id: 'u309',
          fullname: 'Sofia Rossi',
          imgUrl: '/assets/OfficalGigDemoData/ProfilePicture/[Profile]73.png',
        },
      },
    ],
    createdAt: now,
    updatedAt: now,
  }

  const existing = await collection.findOne({
    'owner.fullname': gig.owner.fullname,
    title: gig.title,
  })

  if (existing) {
    await collection.updateOne(
      { _id: existing._id },
      { $set: { ...gig, updatedAt: Date.now() } }
    )
    console.log('Updated existing Stefan gig:', existing._id.toString())
  } else {
    const res = await collection.insertOne(gig)
    console.log('Inserted Stefan gig:', res.insertedId.toString())
  }

  await dbService.close()
}

main().catch((err) => {
  console.error('Failed to add Stefan gig:', err)
  process.exit(1)
})
