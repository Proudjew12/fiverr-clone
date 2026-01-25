
import { useRef, useState } from 'react'
import { SvgIcon } from '@/components/svg/SvgIcon'
import demoData from '@/data/demo-data.json'
import { utilService } from '@/services/util.service'

export function GigPreview({ gig }) {
    const { title, price, owner, videoUrls, _id } = gig
    const vidRef = useRef(null)
    const [isWishlisted, setIsWishlisted] = useState(() =>
        isInWishlist(_id)
    )

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
        const next = toggleWishlist({
            gigId: _id,
            title,
            price,
            previewImg: getWishlistThumb(videoUrls),
        })
        setIsWishlisted(next)
    }

    return (
        <article className="fiverr-gig-card">

            <div className="card-media">
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
                        fillColor="#ffffff"
                        strokeColor="#ffffff"
                    />
                </button>

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
                    <span className="seller-Level">Level {owner.level}</span>
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

const WISHLIST_STORAGE_KEY = 'wishlist'
const FALLBACK_THUMBS = demoData.fallbackThumbs

function getWishlistThumb(videoUrls = []) {
    const src = Array.isArray(videoUrls) ? videoUrls[0] : videoUrls
    if (!src || typeof src !== 'string') return utilService.pickRandom(FALLBACK_THUMBS)
    const trimmed = src.trim()
    if (!trimmed) return utilService.pickRandom(FALLBACK_THUMBS)
    const ext = trimmed.split('.').pop().toLowerCase()
    if (['mp4', 'webm', 'ogg'].includes(ext)) {
        return utilService.pickRandom(FALLBACK_THUMBS)
    }
    return trimmed
}

function getVideoSrc(videoUrls) {
    if (Array.isArray(videoUrls)) {
        const src = videoUrls.find((item) => typeof item === 'string' && item.trim())
        if (src) return src
    }
    if (typeof videoUrls === 'string' && videoUrls.trim()) return videoUrls.trim()
    return utilService.pickRandom(demoData.randomGig.videos)
}

function loadWishlist() {
    return utilService.loadFromStorage(WISHLIST_STORAGE_KEY, [])
}

function isInWishlist(gigId) {
    return loadWishlist().some((item) => item.gigId === gigId)
}

function toggleWishlist(item) {
    const list = loadWishlist()
    const exists = list.find((entry) => entry.gigId === item.gigId)
    let next
    if (exists) {
        next = list.filter((entry) => entry.gigId !== item.gigId)
    } else {
        next = [
            {
                ...item,
                id: utilService.makeId(),
                createdAt: Date.now(),
                status: 'saved',
            },
            ...list,
        ]
    }
    utilService.saveToStorage(WISHLIST_STORAGE_KEY, next)
    window.dispatchEvent(new CustomEvent('wishlist-updated'))
    return !exists
}
