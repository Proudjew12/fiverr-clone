import { ReviewList } from '@/components/review/ReviewList'
import { SvgIcon } from '@/components/svg/SvgIcon'
import { Loader } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGigDetails } from '@/hooks/useGigDetails'

export function GigDetails() {
  const { gigId } = useParams()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState(1)
  const reviewsTitle = useRef()

  const { gig, gigImgs, index, setIndex, setImg, isLoading } = useGigDetails(gigId)
  function getFileType(src) {
    const extension = src.split('.').pop().toLowerCase()

    if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return 'image'

    return 'unknown'
  }

  if (isLoading) return <Loader />
  if (!gig) return null
  return (
    <div className="main-layout-details">
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
                  {gig.owner.level === 'top rated'
                    ? 'Top Rated'
                    : gig.owner.level === '2'
                      ? 'Level 2'
                      : gig.owner.level === '1'
                        ? 'Level 1'
                        : ''}
                  {gig.owner.level !== 'basic' ? (
                    <div className="stars">
                      <SvgIcon icon={'starBlack'} />
                      <SvgIcon
                        icon={gig.owner.level !== '1' ? 'starBlack' : 'starTranspet'}
                      />
                      <SvgIcon
                        icon={
                          gig.owner.level === 'top rated' ? 'starBlack' : 'starTranspet'
                        }
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="rate">
                {' '}
                <RatingByStars rate={gig.owner.rate} />
                {gig.owner.rate}
                <span
                  className="reviews-counter"
                  onClick={() => {
                    reviewsTitle.current?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }}
                >
                  ({gig.reviews.length} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="slider">
            <button className="arrow left" onClick={() => setImg(-1)}>
              ‹
            </button>
            {getFileType(gigImgs[index]) === 'video' ? (
              <video src={gigImgs[index]} muted autoPlay loop playsInline />
            ) : (
              <img src={`${gigImgs[index]}`} alt="Hero visual" />
            )}
            <button className="arrow right" onClick={() => setImg(1)}>
              ›
            </button>
          </div>
          <div className="thumbnails-wrapper">
            <button className="thumb-arrow" onClick={() => setImg(-1)}>
              ‹
            </button>

            <div className="thumbnails">
              {gigImgs.map((img, i) =>
                getFileType(img) === 'video' ? (
                  <video
                    key={i}
                    src={img}
                    className={`thumbnail ${i === index ? 'active' : ''}`}
                    onClick={() => setIndex(i)}
                    alt="thumbnail"
                  />
                ) : (
                  <img
                    key={i}
                    src={img}
                    className={`thumbnail ${i === index ? 'active' : ''}`}
                    onClick={() => setIndex(i)}
                    alt="thumbnail"
                  />
                )
              )}
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
            <div className="seller-stats">
              <div className="seller-img">
                <img src={gig.owner.imgUrl} />
              </div>
              <div className="seller-name-rate">
                <span className="fullname">{gig.owner.fullname}</span>
                <span>Performance Marketer And Ad Creative Specialist</span>
                <div className={'level ' + gig.owner.level.replace(/\s+/g, '-')}>
                  {gig.owner.level === 'top rated'
                    ? 'Top Rated'
                    : gig.owner.level === '2'
                      ? 'Level 2'
                      : gig.owner.level === '1'
                        ? 'Level 1'
                        : ''}
                  {gig.owner.level !== 'basic' ? (
                    <div className="stars">
                      <SvgIcon icon={'starBlack'} />
                      <SvgIcon
                        icon={gig.owner.level !== '1' ? 'starBlack' : 'starTranspet'}
                      />
                      <SvgIcon
                        icon={
                          gig.owner.level === 'top rated' ? 'starBlack' : 'starTranspet'
                        }
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
            <button className="contact-btn">Contact me</button>
            <div className="seller-details">
              <ul>
                <li>
                  From: <br />
                  <strong>{gig.loc}</strong>
                </li>
                <li>
                  Avg. respone time: <br />
                  <strong>{gig.avgResponseTime} hours</strong>
                </li>
                <li>
                  Languages: <br />
                  <strong>English, German</strong>
                </li>
                <li>
                  Member since: <br />
                  <strong>Jan 2023</strong>
                </li>
                <li>
                  Last Delivery: <br />
                  <strong>18 hours</strong>
                </li>
              </ul>
            </div>
          </div>
          <div className="reviews-title" ref={reviewsTitle}>
            Reviews
          </div>
          <span className="reviews-sub-title">
            <span>{gig.reviews.length} reviews for this Gig</span>
            <span className="rate">
              <RatingByStars rate={gig.owner.rate} />
              {gig.owner.rate}
            </span>
          </span>
          <ReviewList reviews={gig.reviews} />
        </div>
        <aside>
          <div className="call-to-action">
            <div className="tabs-container">
              <div
                className={selectedTab === 1 ? 'tab selected' : 'tab'}
                onClick={() => {
                  setSelectedTab(1)
                }}
              >
                Basic
              </div>
              <div
                className={selectedTab === 2 ? 'tab selected' : 'tab'}
                onClick={() => {
                  setSelectedTab(2)
                }}
              >
                Standard
              </div>
              <div
                className={selectedTab === 3 ? 'tab selected' : 'tab'}
                onClick={() => {
                  setSelectedTab(3)
                }}
              >
                Premium
              </div>
            </div>
            <div className="package-content">
              <header>
                <span className="title">
                  {' '}
                  <span className="price">{gig.price * selectedTab}$</span> + taxes & fees
                </span>
                <br />
                <span className="sub-title">
                  Save up to 20% with <span className="subscribe">Subscribe to Save</span>
                </span>
                <p>
                  <b>
                    {selectedTab === 1
                      ? 'Basic Ad'
                      : selectedTab === 2
                        ? 'Standard Ad'
                        : 'Premium Ad'}{' '}
                  </b>
                  {selectedTab === 1
                    ? `I will turn your video into a high-converting ad.
                Includes captions, b-roll, transitions and SFX.`
                    : selectedTab === 2
                      ? 'Everything in Basic + animations & motion graphics for maximum engagement + 3 hooks.'
                      : 'I will create 3 Premium Ads with animations & motion graphics + 3 hooks each. (9 versions total)'}
                </p>
              </header>
              <main>
                <div className="delivery">
                  <SvgIcon icon={'time'} />
                  {gig.daysToMake + selectedTab}-day delivery
                </div>
                <ul className="features">
                  <li>
                    <SvgIcon icon={'vBlack'} />
                    <span> Up to Unlimited minutes of footage provided</span>
                  </li>
                  <li>
                    <SvgIcon icon={'vBlack'} />
                    <span> Up to 1 minute running time</span>
                  </li>
                  <li>
                    <SvgIcon icon={selectedTab > 1 ? 'vBlack' : 'vGray'} />
                    <span> Color grading</span>
                  </li>
                  <li>
                    <SvgIcon icon={selectedTab > 1 ? 'vBlack' : 'vGray'} />
                    <span> Sound design & mixing</span>
                  </li>
                  <li>
                    <SvgIcon icon={selectedTab > 2 ? 'vBlack' : 'vGray'} />
                    <span> Motion graphics</span>
                  </li>
                  <li>
                    <SvgIcon icon={selectedTab > 2 ? 'vBlack' : 'vGray'} />
                    <span> Subtitles</span>
                  </li>
                </ul>
              </main>
              <footer>
                <button
                  className="continue-btn"
                  onClick={() => navigate(`/gig/${gigId}/payment`)}
                >
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
    </div>
  )
}
export function RatingByStars({ rate }) {
  return (
    <div className="rating-by-stars">
      {Array.from({ length: rate }).map((_, i) => (
        <SvgIcon icon={'star'} key={i} />
      ))}
    </div>
  )
}
