
import { useState } from 'react'
import { Link } from 'react-router-dom'


export function GigPreview({ gig }) {
    const { title, price, owner, videoUrls,description} = gig

    return (
        <article className="fiverr-gig-card">

            <div className="card-media">
                <video width="500" controls>
                    <source src={videoUrls} type="video/mp4" />
                </video>
            </div>


            <div className="card-content">
                <div className="seller-row">
                    <img className="seller-avatar" src={owner.imgUrl} alt={owner.fullname} />
                    <span className="seller-name">{owner.fullname}</span>
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
                        <span className="price-tag">₪{Math.round(price * 4)}</span>
                    </div>
                    <span className="tax-fees-note">+ taxes & fees </span>
                </div>
            </div>
        </article>
    )
}