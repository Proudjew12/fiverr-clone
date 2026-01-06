
import { useState } from 'react'
import { Link } from 'react-router-dom'



export function GigPreview({ gig }) {
    const [isImgLoading, setImgLoading] = useState(true)

    function handleImageLoad() {
        setImgLoading(false)
    }
    return (
        <Link to={`/gig/${gig._id}`}>
            <article className="gig-preview">
                <h1 className="gig-name">{gig.name}</h1>
                {isImgLoading && <div className="skeleton-loader"></div>}
                <div className="img-container">
                    <img
                        src={`https://robohash.org/${toy.name}?set=set4`}
                        alt={gig.name}
                        onLoad={handleImageLoad}
                        style={{ display: isImgLoading ? 'none' : 'block' }}
                    />
                </div>
                <h1>Price: ${gig.price}</h1>
            </article>
        </Link>
    )
}