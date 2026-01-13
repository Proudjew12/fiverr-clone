import { SvgIcon } from '@/components/svg/SvgIcon'
import { gigService } from '@/services/leo.service.local.js'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export function GigDetails() {
  const { gigId } = useParams()
  const [gig, setGig] = useState(null)
  const [gigImgs, setGigImgs] = useState([])
  const imgs = [
    '/assets/Details/Stefan/img/FF6571B6-B693-4818-84F9-23B3BDA495E1.jpeg',
    '/assets/Popular-Services/Video-Editing/img/0d93cdad-9c44-4d44-b3f2-6052d0faab17.png',
    '/assets/Details/Stefan/img/FF6571B6-B693-4818-84F9-23B3BDA495E1.jpeg',
    '/assets/Popular-Services/Video-Editing/img/0d93cdad-9c44-4d44-b3f2-6052d0faab17.png',
  ]
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (gigId) loadGig()
  }, [gigId])

  async function loadGig() {
    try {
      const gig = await gigService.getById(gigId)
      setGig(gig)
      setGigImgs([...gig.imgUrls])
    } catch (error) {
      console.log('There is no gig with id:', gigId, error)
    }
  }
  function setImg(diff) {
    if (index + diff === imgs.length) setIndex(0)
    else if (index + diff === -1) setIndex(imgs.length - 1)
    else setIndex((index) => index + diff)
  }
  if (!gig) return <Loader />
  return (
    <section className="gig-details">
      <div className="main">
        <h1>{gig.title}</h1>
        <div className="owner-container">
          <div className="profile-img-container">
            <img src={gig.owner.imgUrl} />
          </div>
          <div className="name-rate-container">
            <div className="owner-details">
              <div className="fullname">{gig.owner.fullname}</div>{' '}
              <div className={'level ' + gig.owner.level.replace(/\s+/g, '-')}>
                {gig.owner.level}
              </div>
            </div>
            <div className="rate">
              {' '}
              <RatingByStars rate={gig.owner.rate} />
              {gig.owner.rate}
            </div>
          </div>
        </div>
        <div className="slider">
          <button className="arrow left" onClick={() => setImg(-1)}>
            ‹
          </button>
          <img src={`${imgs[index]}`} alt="Hero visual" />
          <button className="arrow right" onClick={() => setImg(1)}>
            ›
          </button>
        </div>
        <div className="thumbnails-wrapper">
          <button className="thumb-arrow" onClick={() => setImg(-1)}>
            ‹
          </button>

          <div className="thumbnails">
            {imgs.map((img, i) => (
              <img
                key={i}
                src={img}
                className={`thumbnail ${i === index ? 'active' : ''}`}
                onClick={() => setIndex(i)}
                alt="thumbnail"
              />
            ))}
          </div>

          <button className="thumb-arrow" onClick={() => setImg(1)}>
            ›
          </button>
        </div>
        <h2>About this gig</h2>
        <div className="description-container">
          <p>{gig.description}</p>
        </div>
        <p className="type">Type</p>
        <ul className="tags">
          {gig.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="about-the-seller">
          <h2>Get to know {gig.owner.fullname}</h2>
          <div className="seller-details">
            <div className="seller-img">
              <img src={gig.owner.imgUrl} />
            </div>
            <div className="seller-name-rate">
              <span className="fullname">{gig.owner.fullname}</span>
              <span>Performance Marketer And Ad Creative Specialist</span>
              <span className={'level ' + gig.owner.level.replace(/\s+/g, '-')}>
                {gig.owner.level}
              </span>
            </div>
          </div>
          <button className="contact-btn">Contact me</button>
        </div>
      </div>
      <aside>
        <div className="call-to-action">
          <div className="package-content">
            <header>
              <span className="title">
                {' '}
                <span className="price">{gig.price}$</span> + taxes & fees
              </span>
              <br />
              <span className="sub-title">
                Save up to 20% with <span className="subscribe">Subscribe to Save</span>
              </span>
              <p>
                <b>Standard Ad </b>I will turn your video into a high-converting ad.
                Includes captions, b-roll, transitions and SFX.
              </p>
            </header>
            <main>
              <ul className="features">
                <li>
                  <SvgIcon icon={'v'} />
                  <span> Up to Unlimited minutes of footage provided</span>
                </li>
                <li>
                  <SvgIcon icon={'v'} />
                  <span> Up to 1 minute running time</span>
                </li>
                <li>
                  <SvgIcon icon={'v'} />
                  <span> Color grading</span>
                </li>
                <li>
                  <SvgIcon icon={'v'} />
                  <span> Sound design & mixing</span>
                </li>
                <li>
                  <SvgIcon icon={'v'} />
                  <span> Motion graphics</span>
                </li>
                <li>
                  <SvgIcon icon={'v'} />
                  <span> Subtitles</span>
                </li>
              </ul>
            </main>
            <footer>
              <button className="continue-btn">
                Continue{' '}
                <span>
                  <SvgIcon icon={'rightArrow'} />
                </span>
              </button>
              <button className="contact-btn">
                Contact me
                <div>
                  <SvgIcon icon={'downArrow'} />
                </div>
              </button>
            </footer>
          </div>
        </div>
      </aside>
    </section>
  )
}
function RatingByStars({ rate }) {
  return (
    <div className="rating-by-stars">
      {Array.from({ length: rate }).map((_, i) => (
        <SvgIcon icon={'star'} key={i} />
      ))}
    </div>
  )
}
