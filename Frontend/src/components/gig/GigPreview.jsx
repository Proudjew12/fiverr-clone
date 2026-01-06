
import { useState } from 'react'
import { Link } from 'react-router-dom'


export function GigPreview({ gig }) {
    const { title, price, owner, videoUrls,description} = gig

    return (
        <article className="fiverr-gig-card">

            <div className="card-media">
                <video width="600" controls>
                    <source src={videoUrls} type="video/mp4" />
                </video>
                <div className="heart-icon-container">
                    <svg width="18" height="18" viewBox="0 0 16 16"><path d="M8 2.33C6.67 1.05 4.54 1.05 3.2 2.33c-1.33 1.28-1.33 3.36 0 4.64L8 12l4.8-5.03c1.33-1.28 1.33-3.36 0-4.64-1.34-1.28-3.47-1.28-4.8 0z"></path></svg>
                </div>

                <div className="carousel-dots">
                    <span className="dot active"></span>
                    <span className="dot"></span>
                </div>
            </div>


            <div className="card-content">
                <div className="seller-row">
                    <img className="seller-avatar" src={owner.imgUrl} alt={owner.fullname} />
                    <span className="seller-name">{owner.fullname}</span>
                    <span className="ad-label">Ad</span>
                    <div className="top-rated-badge">
                        Top Rated <span className="stars">✦✦✦</span>
                    </div>
                </div>

                <h3 className="gig-title">{title}</h3>

                <div className="rating-row">
                    <span className="star-icon">★</span>
                    <span className="score">{owner.rate}</span>
                    <span className="count">(1k+)</span>
                </div>

                <div className="pricing-row">
                    <div className="price-info">
                        <span className="starting-from">From</span>
                        <span className="price-tag">₪{Math.round(price * 4)}</span>
                    </div>
                    <span className="tax-fees-note">+ taxes & fees / 5 minut...</span>
                </div>
            </div>
        </article>
    )
}