
import { useRef } from 'react'
import { SvgIcon } from '@/components/svg/SvgIcon'
import demoData from '@/data/demo-data.json'
import { utilService } from '@/services/util.service'
import { useWishlist } from '@/hooks/useWishlist'

export function GigPreview({ gig }) {
    const { title, price, owner, videoUrls, _id } = gig
    const vidRef = useRef(null)
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true'
    const isTopRated = owner?.level?.toLowerCase?.() === 'top rated'
    const { isWishlisted, toggleWishlist } = useWishlist({
        gigId: _id,
        title,
        price,
        videoUrls,
    })

    const handleMouseEnter = () => {
        if (vidRef.current) vidRef.current.play()
    }

    const handleMouseLeave = () => {
        if (vidRef.current) {
            vidRef.current.pause()
            vidRef.current.currentTime = 0
        }
    }

    const handleLoadedData = () => {
        if (vidRef.current) {
            vidRef.current.pause()
            vidRef.current.currentTime = 0
        }
    }

    function onToggleWishlist(event) {
        event.stopPropagation()
        toggleWishlist()
    }

    return (
        <article className="fiverr-gig-card">

            <div className="card-media">
                {isSignedIn && (
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
                    width="600"
                    muted
                    loop
                    preload="metadata"
                    playsInline
                    onLoadedData={handleLoadedData}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="gig-video"
                    style={{ cursor: 'pointer' }}
                >
                    <source src={getVideoSrc(videoUrls)} type="video/mp4" />
                </video>
            </div>


            <div className="card-content">
                <div className="seller-row">
                    <div className="mini-layout-seller">
                        <img className="seller-avatar" src={owner.imgUrl} alt={owner.fullname} />
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
                    ) : (
                        <span className="seller-Level">Level {owner.level}</span>
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
        if (src) return src
    }
    if (typeof videoUrls === 'string' && videoUrls.trim()) return videoUrls.trim()
    return utilService.pickRandom(demoData.randomGig.videos)
}
