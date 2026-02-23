
import { useRef } from 'react'
import { SvgIcon } from '@/components/svg/SvgIcon'
import demoData from '@/data/demo-data.json'
import { utilService } from '@/services/util.service'
import { mediaUrlService } from '@/services/media-url.service'
import { useWishlist } from '@/hooks/useWishlist'

export function GigPreview({ gig }) {
    const { title, price, owner, videoUrls, _id } = gig
    const vidRef = useRef(null)
    const previewVideoSrc = getVideoSrc(videoUrls)
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true'
    const isSeller = localStorage.getItem('isSeller') === 'true'
    const ownerLevel = String(owner?.level || '').toLowerCase()
    const isTopRated = ownerLevel === 'top rated'
    const isLevel2 = ownerLevel === '2' || ownerLevel.includes('level 2')
    const isLevel1 = ownerLevel === '1' || ownerLevel.includes('level 1')
    const isBasic = ownerLevel.includes('basic')
    const levelGems = isLevel2 ? 2 : isLevel1 ? 1 : 0
    const { isWishlisted, toggleWishlist } = useWishlist({
        gigId: _id,
        title,
        price,
        videoUrls,
    })

    const handleMouseEnter = () => {
        if (!vidRef.current) return
        const playPromise = vidRef.current.play()
        if (typeof playPromise?.catch === 'function') {
            playPromise.catch(() => {})
        }
    }

    const handleMouseLeave = () => {
        if (!vidRef.current) return
        vidRef.current.pause()
        vidRef.current.currentTime = 0
    }

    function onToggleWishlist(event) {
        event.stopPropagation()
        toggleWishlist()
    }

    return (
        <article className="fiverr-gig-card">

            <div className="card-media">
                {isSignedIn && !isSeller && (
                    <button
                        type="button"
                        className={`wishlist-btn ${isWishlisted ? 'is-active' : ''}`}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        onClick={onToggleWishlist}
                    >
                        <SvgIcon
                            icon="wishlistHeart"
                            className="wishlist-icon"
                            aria-hidden="true"
                            filled={isWishlisted}
                        />
                    </button>
                )}

                <video
                    ref={vidRef}
                    key={previewVideoSrc}
                    width="600"
                    muted
                    loop
                    preload="metadata"
                    playsInline
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="gig-video"
                    style={{ cursor: 'pointer' }}
                >
                    <source src={previewVideoSrc} type="video/mp4" />
                </video>
            </div>


            <div className="card-content">
                <div className="seller-row">
                    <div className="mini-layout-seller">
                        <img
                            className="seller-avatar"
                            src={owner.imgUrl}
                            alt={owner.fullname}
                            loading="lazy"
                            decoding="async"
                        />
                        <span className="seller-name">{owner.fullname}</span>
                    </div>
                    {isTopRated ? (
                        <span className="seller-badge top-rated-badge">
                            <span className="top-rated-label">Top Rated</span>
                            <span className="top-rated-stars" aria-hidden="true">
                                <SvgIcon icon="starBlack" />
                                <SvgIcon icon="starBlack" />
                                <SvgIcon icon="starBlack" />
                            </span>
                        </span>
                    ) : isLevel1 || isLevel2 ? (
                        <span className="seller-level-badge">
                            <span className="seller-level-text">
                                {isLevel2 ? 'Level 2' : 'Level 1'}
                            </span>
                            <span className="seller-level-gems" aria-hidden="true">
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={`gem ${idx < levelGems ? 'is-on' : ''}`}
                                    >
                                        {idx < levelGems ? '◆' : '◇'}
                                    </span>
                                ))}
                            </span>
                        </span>
                    ) : (
                        <span className="seller-Level">
                            {isBasic ? 'New' : `Level ${owner.level}`}
                        </span>
                    )}
                </div>

                <p className="gig-title">{title}</p>

                <div className="rating-row">
                    <span className="star-icon">★</span>
                    <span className="score">{owner.rate}</span>
                    <span className="count">(1k+)</span>
                </div>

                <div className="pricing-row">
                    <div className="price-info">
                        <span className="starting-from">From</span>
                        <span className="price-tag">₪{price}</span>
                        <span className="tax-fees-note">+ taxes & fees </span>
                    </div>
                </div>
            </div>
        </article>
    )
}

function getVideoSrc(videoUrls) {
  if (Array.isArray(videoUrls)) {
    const src = videoUrls.find((item) => typeof item === 'string' && item.trim())
    if (src) return mediaUrlService.resolve(src)
  }
  if (typeof videoUrls === 'string' && videoUrls.trim()) {
    return mediaUrlService.resolve(videoUrls.trim())
  }
  return mediaUrlService.resolve(utilService.pickRandom(demoData.randomGig.videos))
}
