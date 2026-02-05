import { ReviewList } from '@/components/review/ReviewList'
import { SvgIcon } from '@/components/svg/SvgIcon'
import { Loader } from 'lucide-react'
import { Fragment, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGigDetails } from '@/hooks/useGigDetails.js'
import { utilService } from '@/services/util.service'
import { httpService } from '@/services/http.service'

export function GigDetails() {
  const { gigId } = useParams()
  const navigate = useNavigate()
  function handleLoginPrompt() {
    window.dispatchEvent(new CustomEvent('highlight-signin'))
  }
  const [selectedTab, setSelectedTab] = useState(1)
  const [filterBy, setFilterBy] = useState({})
  const reviewsTitle = useRef()
  const sellerTitle = useRef()
  const { gig, gigImgs, index, setIndex, setImg, isLoading } = useGigDetails(gigId)
  const tagToTypeLabel = {
    'web-builder': 'Web Builder',
    'video-editing': 'Video Editing',
    shopify: 'Shopify',
    'ad-social': 'Ad & Social',
  }

  const tagToCategoryLabel = {
    'web-builder': 'Web Builder',
    'video-editing': 'Video Editing',
    shopify: 'Shopify',
    'ad-social': 'Ad & Social',
  }

  function toTitleCase(value) {
    if (!value) return ''
    return value
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  function getFileType(src) {
    const extension = src.split('.').pop().toLowerCase()

    if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return 'image'

    return 'unknown'
  }
  function onSetFilterBy(newFilterBy){
   setFilterBy({...newFilterBy})
  }
  function getAvgRatingFromReviews(reviews = []) {
    if (!reviews.length) return 0
    const sum = reviews.reduce((acc, review) => acc + (review?.rate || 0), 0)
    const avg = sum / reviews.length
    return Math.floor(avg * 10) / 10
  }
  if (isLoading) return <Loader />
  if (!gig) return null

  const isSignedIn = localStorage.getItem('isSignedIn') === 'true'
  const isSeller = localStorage.getItem('isSeller') === 'true'
  const isStefan = gig?.owner?.fullname?.toLowerCase?.().includes('stefan')
  const stefanReviewCount = gig?.reviews?.length || 0
  const reviewTotal = gig?.reviews?.length || 0
  const ratingCounts = [5, 4, 3, 2, 1].map((score) =>
    gig?.reviews?.filter((review) => Math.round(review.rate) === score).length || 0
  )
  const ratingAverage = getAvgRatingFromReviews(gig?.reviews || [])
  const ratingPercent = (count) => (reviewTotal ? (count / reviewTotal) * 100 : 0)

  const ownerLevel = String(gig?.owner?.level || '').toLowerCase()
  const primaryTag = gig?.tags?.[0] || ''
  const typeLabel = tagToTypeLabel[primaryTag] || toTitleCase(primaryTag) || 'Gig'
  const homeTarget = isSignedIn ? '/index' : '/'

  return (
    <div className="main-layout-details">
      <section className="gig-details">
        <div className="main">
          <div className="gig-breadcrumb" aria-label="Breadcrumb">
            {[
              {
                key: 'home',
                node: (
                  <button
                    type="button"
                    className="breadcrumb-home"
                    onClick={() => navigate(homeTarget)}
                    aria-label="Go to home"
                  >
                    <SvgIcon icon="home" className="breadcrumb-home-icon" />
                  </button>
                ),
              },
              {
                key: 'explore',
                node: (
                  <button
                    type="button"
                    className="breadcrumb-link"
                    onClick={() => navigate('/index')}
                  >
                    Explore
                  </button>
                ),
              },
              {
                key: 'type',
                node: <span className="breadcrumb-type">{typeLabel}</span>,
              },
            ].map((item, idx) => (
              <Fragment key={item.key}>
                {idx > 0 && <span className="breadcrumb-sep">/</span>}
                {item.node}
              </Fragment>
            ))}
          </div>
          <h1>{gig.title}</h1>
          <div className="owner-container">
            <div className="profile-img-container">
              <img src={gig.owner.imgUrl} />
            </div>
            <div className="name-rate-container">
              <div className="owner-details">
                <div onClick={() => {
                    sellerTitle.current?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }} className="fullname">{gig.owner.fullname}</div>{' '}
                <div className={'level ' + gig.owner.level.replace(/\s+/g, '-')}>
                  {ownerLevel === 'top rated'
                    ? 'Top Rated'
                    : ownerLevel === '2'
                      ? 'Level 2'
                      : ownerLevel === '1'
                        ? 'Level 1'
                        : ownerLevel === 'basic'
                          ? 'New'
                        : ''}
                  {ownerLevel !== 'basic' ? (
                    <div className="stars">
                      <SvgIcon icon={'starBlack'} />
                      <SvgIcon
                        icon={ownerLevel !== '1' ? 'starBlack' : 'starTranspet'}
                      />
                      <SvgIcon
                        icon={
                          ownerLevel === 'top rated' ? 'starBlack' : 'starTranspet'
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
                <RatingByStars rate={getAvgRatingFromReviews()} />
                {(getAvgRatingFromReviews())?getAvgRatingFromReviews():''}
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
            {gig.descriptionHtml ? (
              <div
                className="rich-description"
                dangerouslySetInnerHTML={{ __html: gig.descriptionHtml }}
              />
            ) : (
              <p>{gig.description}</p>
            )}
          </div>
          <p className="type">Type</p>
          <ul className="tags">
            {gig.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <div className="about-the-seller">
            <h2 className='seller-title' ref={sellerTitle}>Get to know {gig.owner.fullname}</h2>
            {isStefan ? (
              <div className="stefan-profile">
                <div className="stefan-header">
                  <div className="stefan-avatar">
                    <img src={gig.owner.imgUrl} alt={gig.owner.fullname} />
                  </div>
                  <div className="stefan-meta">
                    <div className="stefan-name-row">
                      <span className="stefan-name">Stefan G.</span>
                      <span className="stefan-online">
                        <span className="dot" />
                        Online
                      </span>
                    </div>
                    <div className="stefan-role">
                      Performance Marketer And Ad Creative Specialist
                    </div>
                    <div className="stefan-rating-row">
                      <span className="stefan-rating">
                        <SvgIcon icon={'star'} />
                        {gig.owner.rate}
                        <span className="stefan-reviews">({stefanReviewCount})</span>
                      </span>
                      <span className="stefan-divider">|</span>
                      <span className="stefan-toprated">
                        Top Rated
                        <span className="stefan-toprated-stars">
                          <SvgIcon icon={'starBlack'} />
                          <SvgIcon icon={'starBlack'} />
                          <SvgIcon icon={'starBlack'} />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="stefan-actions">
                  <button className="stefan-contact-btn">Contact me</button>
                </div>

                <div className="stefan-card">
                  <p>
                    Stefan G. is part of the Leo Pro catalog and has been
                    hand-picked by a dedicated Leo Pro team for their skills and
                    expertise.
                  </p>
                  <div className="stefan-vetted">
                    <p className="stefan-vetted-title">Vetted for</p>
                    <p className="stefan-vetted-item">✓ Social Media Videos</p>
                  </div>
                  <div className="stefan-grid">
                    <div>
                      <span>From</span>
                      <strong>Serbia</strong>
                    </div>
                    <div>
                      <span>Member since</span>
                      <strong>Jan 2023</strong>
                    </div>
                    <div>
                      <span>Avg. response time</span>
                      <strong>1 hour</strong>
                    </div>
                    <div>
                      <span>Last delivery</span>
                      <strong>about 12 hours</strong>
                    </div>
                    <div>
                      <span>Languages</span>
                      <strong>English, Serbian</strong>
                    </div>
                  </div>
                  <div className="stefan-bio">
                    <p>Hi, I'm Stefan.</p>
                    <p>
                      I have 8+ years of experience in content creation and over
                      3 years in digital marketing, specializing in high-converting
                      ad creatives and profitable growth strategies.
                    </p>
                    <p>
                      I've worked with world-class brands and produced 1000+ ad
                      creatives that helped generate $10M+ in profitable revenue.
                    </p>
                    <p>
                      Now, I help eCommerce brands, agencies, and coaching
                      businesses create scroll-stopping ads and scale with FB/IG
                      ads.
                    </p>
                    <p>Message me now to get started.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="seller-stats">
                  <div className="seller-img">
                    <img src={gig.owner.imgUrl} />
                  </div>
                  <div className="seller-name-rate">
                    <span className="fullname">{gig.owner.fullname}</span>
                    <span>Performance Marketer And Ad Creative Specialist</span>
                    <div className='rate-level-container'>
                      <div className='rate'>
                        <SvgIcon icon={'star'} />
                        {gig.owner.rate}
                      </div>
                      <div className={(ownerLevel === 'basic') ? 'hidden' : 'level ' + gig.owner.level.replace(/\s+/g, '-')}>
                        {ownerLevel === 'top rated'
                          ? 'Top Rated'
                          : ownerLevel === '2'
                            ? 'Level 2'
                            : ownerLevel === '1'
                              ? 'Level 1'
                              : ownerLevel === 'basic'
                                ? 'New'
                              : ''}
                        {ownerLevel !== 'basic' ? (
                          <div className="stars">
                            <SvgIcon icon={'starBlack'} />
                            <SvgIcon
                              icon={ownerLevel !== '1' ? 'starBlack' : 'starTranspet'}
                            />
                            <SvgIcon
                              icon={
                                ownerLevel === 'top rated' ? 'starBlack' : 'starTranspet'
                              }
                            />
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
              </>
            )}
          </div>
          <div className="reviews-title" ref={reviewsTitle}>
            Reviews
          </div>
          <div className="reviews-summary">
            <div className="reviews-summary-header">
              <span>{reviewTotal} reviews for this Gig</span>
              <span className="summary-rating">
                <RatingByStars rate={ratingAverage} />
                {ratingAverage ? ratingAverage : ''}
              </span>
            </div>
            <div className="reviews-summary-grid">
              <div className="reviews-breakdown">
                {[5, 4, 3, 2, 1].map((score, idx) => (
                  <button
                    key={score}
                    type="button"
                    className={`breakdown-row ${
                      filterBy?.rating === score ? 'is-active' : ''
                    }`}
                    onClick={() =>
                      onSetFilterBy(
                        filterBy?.rating === score ? {} : { ...filterBy, rating: score }
                      )
                    }
                  >
                    <span className="breakdown-label">{score} Stars</span>
                    <span className="breakdown-bar">
                      <span
                        className="breakdown-fill"
                        style={{ width: `${ratingPercent(ratingCounts[idx])}%` }}
                      />
                    </span>
                    <span className="breakdown-count">({ratingCounts[idx]})</span>
                  </button>
                ))}
              </div>
              <div className="reviews-rating-breakdown">
                <div className="breakdown-title">Rating Breakdown</div>
                <div className="rating-breakdown-row">
                  <span>Seller communication level</span>
                  <span className="rating-score">★ {ratingAverage || 0}</span>
                </div>
                <div className="rating-breakdown-row">
                  <span>Quality of delivery</span>
                  <span className="rating-score">★ {ratingAverage || 0}</span>
                </div>
                <div className="rating-breakdown-row">
                  <span>Value of delivery</span>
                  <span className="rating-score">★ {ratingAverage || 0}</span>
                </div>
              </div>
            </div>
          </div>
          <ReviewList reviews={gig.reviews} filterBy={filterBy} />
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
                  <span className="price">{Number(gig.price * selectedTab).toFixed(2)}$</span> + taxes & fees
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
                {isSeller ? (
                  <button className="continue-btn is-disabled" disabled>
                    You're a seller yourself
                  </button>
                ) : !isSignedIn ? (
                  <button
                    type="button"
                    className="continue-btn is-disabled"
                    aria-disabled="true"
                    onClick={handleLoginPrompt}
                  >
                    Please login first
                  </button>
                ) : (
                  <button
                    className="continue-btn"
                    onClick={() =>
                      navigate(
                        `/gig/${gigId}/payment/${Number(gig.price * selectedTab).toFixed(2)}`
                      )
                    }
                  >
                    Continue{' '}
                    <span>
                      <SvgIcon icon={'rightArrow'} />
                    </span>
                  </button>
                )}
                
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
