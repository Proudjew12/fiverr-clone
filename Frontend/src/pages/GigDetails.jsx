import { ReviewList } from '@/components/review/ReviewList'
import { SvgIcon } from '@/components/svg/SvgIcon'
import { Loader } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGigDetails } from '@/hooks/useGigDetails.js'
import { utilService } from '@/services/util.service'
import { httpService } from '@/services/http.service'
import { SOCKET_EMIT_SEND_MSG, SOCKET_EMIT_SET_TOPIC, SOCKET_EVENT_MSG_SENT, socketService } from '@/services/socket.service'

export function GigDetails() {
  const { gigId } = useParams()
  const navigate = useNavigate()
  function handleLoginPrompt() {
    window.dispatchEvent(new CustomEvent('highlight-signin'))
  }
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const chatThreadRef = useRef(null)
  const chatInputRef = useRef(null)
  const fileInputRef = useRef(null)
  const [selectedTab, setSelectedTab] = useState(1)
  const [filterBy, setFilterBy] = useState({})
  const reviewsTitle = useRef()
  const sellerTitle = useRef()
  const { gig, gigImgs, index, setIndex, setImg, isLoading } = useGigDetails(gigId)
  const isSignedIn = localStorage.getItem('isSignedIn') === 'true'
  const isSeller = localStorage.getItem('isSeller') === 'true'
  const customerName = localStorage.getItem('userName') || 'Customer'
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

  function getTimeLabel() {
    try {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return '19:47'
    }
  }

  function handleSuggestionClick(text) {
    setChatMessages((prev) => [...prev, { id: `${Date.now()}-${prev.length}`, text }])
    pushSellerInboxMessage(text)
  }

  function handleSendMessage() {
    const text = chatInput.trim()
    if (!text) return
    const msg = { id: `${Date.now()}-${chatMessages.length}`, text }
    setChatMessages((prev) => [...prev, msg])
    setChatInput('')
    pushSellerInboxMessage(text)
  }

  function handleEmojiClick() {
    const emoji = '😊'
    setChatInput((prev) => `${prev}${emoji}`)
    if (chatInputRef.current) {
      chatInputRef.current.focus()
    }
  }

  function handleAttachClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const text = `Attachment: ${file.name}`
    setChatMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, text },
    ])
    pushSellerInboxMessage(text)
    event.target.value = ''
  }

  function handleChatKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }
function handleMessage(entry) {
    if (!entry) return
    setChatMessages((prev) => [...prev, entry])
  }
  useEffect(() => {
    if (!chatThreadRef.current) return
    socketService.emit(SOCKET_EMIT_SET_TOPIC,'chat')
    socketService.on(SOCKET_EVENT_MSG_SENT,handleMessage)
    
    chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight
    return ()=>{socketService.off(SOCKET_EVENT_MSG_SENT,handleMessage)}
  }, [chatMessages.length, isChatOpen, isChatMinimized])

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
  function onSetFilterBy(newFilterBy) {
    setFilterBy({ ...newFilterBy })
  }
  function getAvgRatingFromReviews(reviews = []) {
    if (!reviews.length) return 0
    const sum = reviews.reduce((acc, review) => acc + (review?.rate || 0), 0)
    const avg = sum / reviews.length
    return Math.floor(avg * 10) / 10
  }
  if (isLoading) return <Loader />
  if (!gig) return null

  const ownerLevel = String(gig?.owner?.level || '').toLowerCase()
  const primaryTag = gig?.tags?.[0] || ''
  const isTopRatedSeller = ownerLevel === 'top rated'
  const reviewTotal = gig?.reviews?.length || 0
  const ownerName = gig?.owner?.fullname || 'Seller'
  const ownerFirstName = ownerName.split(' ')[0] || 'Seller'
  const ownerDisplayName = (() => {
    const parts = ownerName.split(' ').filter(Boolean)
    if (parts.length < 2) return ownerName
    return `${parts[0]} ${parts[1][0]}.`
  })()
  const ownerRoleLabel =
    {
      'web-builder': 'Web Builder Specialist',
      'video-editing': 'Video Editing Specialist',
      shopify: 'Shopify Store Expert',
      'ad-social': 'Ad & Social Specialist',
    }[primaryTag] || 'Creative Specialist'
  const vettedLabel =
    {
      'web-builder': 'Landing Pages',
      'video-editing': 'Social Media Videos',
      shopify: 'Shopify Stores',
      'ad-social': 'Paid Ad Creatives',
    }[primaryTag] || 'Creative Services'
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (score) =>
      gig?.reviews?.filter((review) => Math.round(review.rate) === score).length || 0
  )
  const ratingAverage = getAvgRatingFromReviews(gig?.reviews || [])
  const ratingPercent = (count) => (reviewTotal ? (count / reviewTotal) * 100 : 0)

  const typeLabel = tagToTypeLabel[primaryTag] || toTitleCase(primaryTag) || 'Gig'
  const homeTarget = isSignedIn ? '/index' : '/'

  function pushSellerInboxMessage(text) {
    if (!text || !gig || !gigId) return
    if (!isSignedIn || isSeller) return
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      gigId,
      gigTitle: gig.title || 'Gig',
      customerName,
      customerImg: '/assets/ProfileImgs/PersonTwo.png',
      text,
      createdAt: Date.now(),
      unread: true,
      from: 'customer',
    }
    let inbox = []
    try {
      const stored = localStorage.getItem('sellerInbox')
      inbox = stored ? JSON.parse(stored) : []
    } catch {
      inbox = []
    }
    socketService.emit(SOCKET_EMIT_SEND_MSG,entry)
    const nextInbox = [entry, ...(Array.isArray(inbox) ? inbox : [])].slice(0, 30)
    localStorage.setItem('sellerInbox', JSON.stringify(nextInbox))
    window.dispatchEvent(new Event('seller-inbox-updated'))
  }

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
                <div
                  onClick={() => {
                    sellerTitle.current?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }}
                  className="fullname"
                >
                  {gig.owner.fullname}
                </div>{' '}
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
                      <SvgIcon icon={ownerLevel !== '1' ? 'starBlack' : 'starTranspet'} />
                      <SvgIcon
                        icon={ownerLevel === 'top rated' ? 'starBlack' : 'starTranspet'}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="rate">
                <RatingByStars rate={getAvgRatingFromReviews(gig?.reviews || [])} />
                {getAvgRatingFromReviews(gig?.reviews || []) || ''}
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
            <h2 className="seller-title" ref={sellerTitle}>
              Get to know {gig.owner.fullname}
            </h2>
            {isTopRatedSeller ? (
              <div className="stefan-profile">
                <div className="stefan-header">
                  <div className="stefan-avatar">
                    <img src={gig.owner.imgUrl} alt={gig.owner.fullname} />
                  </div>
                  <div className="stefan-meta">
                    <div className="stefan-name-row">
                      <span className="stefan-name">{ownerDisplayName}</span>
                      <span className="stefan-online">
                        <span className="dot" />
                        Online
                      </span>
                    </div>
                    <div className="stefan-role">{ownerRoleLabel}</div>
                    <div className="stefan-rating-row">
                      <span className="stefan-rating">
                        <SvgIcon icon={'star'} />
                        {gig.owner.rate}
                        <span className="stefan-reviews">({reviewTotal})</span>
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
                  <button
                    className="stefan-contact-btn"
                    type="button"
                    onClick={() => {
                      if (!isSignedIn) {
                        handleLoginPrompt()
                        return
                      }
                      if (isSeller) return
                      setIsChatOpen(true)
                    }}
                    disabled={!isSignedIn || isSeller}
                    aria-disabled={!isSignedIn || isSeller}
                  >
                    Contact me
                  </button>
                </div>

                <div className="stefan-card">
                  <p>
                    {ownerDisplayName} is part of the Leo Pro catalog and has been
                    hand-picked by a dedicated Leo Pro team for their skills and
                    expertise.
                  </p>
                  <div className="stefan-vetted">
                    <p className="stefan-vetted-title">Vetted for</p>
                    <p className="stefan-vetted-item">✓ {vettedLabel}</p>
                  </div>
                  <div className="stefan-grid">
                    <div>
                      <span>From</span>
                      <strong>{gig.loc || 'United States'}</strong>
                    </div>
                    <div>
                      <span>Member since</span>
                      <strong>Jan 2023</strong>
                    </div>
                    <div>
                      <span>Avg. response time</span>
                      <strong>{gig.avgResponseTime || 1} hour</strong>
                    </div>
                    <div>
                      <span>Last delivery</span>
                      <strong>about 12 hours</strong>
                    </div>
                    <div>
                      <span>Languages</span>
                      <strong>English</strong>
                    </div>
                  </div>
                  <div className="stefan-bio">
                    <p>Hi, I'm {ownerFirstName}.</p>
                    <p>
                      I focus on conversion-first creatives with clean pacing, clear
                      messaging, and performance-driven edits tailored to your brand.
                    </p>
                    <p>
                      I deliver polished videos that help you retain attention and drive
                      action across ads, social, and landing pages.
                    </p>
                    <p>If you have a project ready, message me and we can move fast.</p>
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
                    <div className="rate-level-container">
                      <div className="rate">
                        <SvgIcon icon={'star'} />
                        {gig.owner.rate}
                      </div>
                      <div
                        className={
                          ownerLevel === 'basic'
                            ? 'hidden'
                            : 'level ' + gig.owner.level.replace(/\s+/g, '-')
                        }
                      >
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
        {isTopRatedSeller && isChatOpen && (
          <div
            className={`stefan-chat-widget ${isChatMinimized ? 'is-minimized' : ''}`}
            role="dialog"
            aria-label={`Message ${ownerDisplayName}`}
          >
            {!isChatMinimized && (
              <>
                <div className="stefan-chat-top">
                  <span>
                    It&apos;s {getTimeLabel()} for {ownerDisplayName}. It might take some
                    time to get a response
                  </span>
                </div>
                <div className="stefan-chat-header">
                  <div className="stefan-chat-avatar">
                    <img src={gig.owner.imgUrl} alt={gig.owner.fullname} />
                  </div>
                  <div className="stefan-chat-meta">
                    <div className="stefan-chat-title">Message {ownerDisplayName}</div>
                    <div className="stefan-chat-subtitle">
                      Away · Avg. response time: 1 Hour
                    </div>
                  </div>
                  <button
                    type="button"
                    className="stefan-chat-close"
                    onClick={() => setIsChatMinimized(true)}
                    aria-label="Minimize chat"
                  >
                    ×
                  </button>
                </div>
              </>
            )}
            {!isChatMinimized && (
              <>
                <div className="stefan-chat-body">
                  {chatMessages.length === 0 && (
                    <p className="stefan-chat-hint">
                      Ask {ownerDisplayName} a question or share your project details
                      (requirements, timeline, budget, etc.)
                    </p>
                  )}
                  <div className="stefan-chat-thread" ref={chatThreadRef}>
                    {chatMessages.map((message) => (
                      <div key={message.id} className="stefan-chat-bubble is-user">
                        {message.text}
                      </div>
                    ))}
                  </div>
                  {chatMessages.length === 0 && (
                    <div className="stefan-chat-suggestions">
                      <button
                        type="button"
                        onClick={() =>
                          handleSuggestionClick(
                            `Hey ${ownerFirstName}, can you edit my ads?`
                          )
                        }
                      >
                        Hey {ownerFirstName}, can you edit my ads?
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSuggestionClick(
                            'Can you help improve my hooks and pacing?'
                          )
                        }
                      >
                        Can you help improve my hooks and pacing?
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSuggestionClick(
                            'I have a project ready. What do you need?'
                          )
                        }
                      >
                        I have a project ready. What do you need?
                      </button>
                    </div>
                  )}
                  <textarea
                    className="stefan-chat-input"
                    rows="3"
                    maxLength={2500}
                    placeholder="Type your message..."
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={handleChatKeyDown}
                    ref={chatInputRef}
                  />
                  <div className="stefan-chat-count">{chatInput.length}/2500</div>
                </div>
                <div className="stefan-chat-footer">
                  <div className="stefan-chat-actions">
                    <button
                      type="button"
                      className="icon-btn icon-emoji"
                      aria-label="Emoji"
                      onClick={handleEmojiClick}
                    >
                      ☺
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-attach"
                      aria-label="Attach"
                      onClick={handleAttachClick}
                    >
                      📎
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="chat-file-input"
                      onChange={handleFileChange}
                    />
                  </div>
                  <button
                    type="button"
                    className={`stefan-chat-send ${chatInput.trim() ? 'is-active' : ''}`}
                    disabled={!chatInput.trim()}
                    onClick={handleSendMessage}
                  >
                    Send message
                  </button>
                </div>
              </>
            )}
            {isChatMinimized && (
              <div
                className="stefan-chat-minimized"
                onClick={() => setIsChatMinimized(false)}
              >
                <div className="stefan-chat-avatar">
                  <img src={gig.owner.imgUrl} alt={gig.owner.fullname} />
                </div>
                <div className="stefan-chat-meta">
                  <div className="stefan-chat-title">Message {ownerDisplayName}</div>
                  <div className="stefan-chat-subtitle">
                    Online · Avg. response time: 1 Hour
                  </div>
                </div>
                <span className="stefan-chat-dot" />
              </div>
            )}
          </div>
        )}
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
                  <span className="price">
                    {Number(gig.price * selectedTab).toFixed(2)}$
                  </span>{' '}
                  + taxes & fees
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
